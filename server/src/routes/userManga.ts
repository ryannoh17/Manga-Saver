import express from 'express';
// import { ObjectId } from 'mongoose';
import { User } from '../schemas/user.js';
import { Manga } from '../schemas/manga.js';

interface UserMangaParams {
    username: string;
    title?: string;
}

const router = express.Router({ mergeParams: true });

/**
 * adds a new user manga to user profile
 * if it already exists update it instead
 */
router.post('/', async (req: express.Request<UserMangaParams>, res) => {
    const { username } = req.params;
    const { title, chapter } = req.body;

    console.log(title, chapter, username)

    const fetchedManga = await Manga.findOne({ title: title });

    if (!fetchedManga) {
        return res.send({
            message: `manga ${title} does not exist`
        });
    }

    const mangaID = fetchedManga?._id;

    try {
        await User.updateOne(
            { username: username },
            {
                $addToSet: {
                    mangaList: {
                        mangaDetail: mangaID,
                        currentChapter: chapter,
                        highestChapter: chapter
                    }
                }
            }
        ).then(async (addResult) => {
            if (addResult.modifiedCount === 0) {
                console.log(addResult);
                console.log('trying to add new user manga');
                await User.updateOne(
                    {
                        username: username,
                        'mangaList.mangaDetail': mangaID,
                    },
                    {
                        $set: {
                            'mangaList.$.currentChapter': chapter,
                            'mangaList.$.dateRead': new Date,
                        },
                        $max: {
                            'mangaList.$.highestChapter': chapter
                        }
                    }
                );

                return res.send({
                    message: 'user manga already exists, updated existing manga',
                }).status(201);
            }
        });

        return res.send({
            message: `new user manga ${title} added to ${username}`
        }).status(201);
    } catch {
        return res.send({
            message: 'unexpected error adding user manga'
        }).status(501);
    }
});

/**
 * gets the user's manga
 */
router.get('/', async (req: express.Request<UserMangaParams>, res) => {
    const { username } = req.params;

    let user = await User
        .findOne({ username: username })
        .populate('mangaList.mangaDetail');

    if (!user) return res.send({
        message: 'user does not exist'
    }).status(401);

    return res.send(user.mangaList).status(201);
});

/**
 * updates manga information
 * UP TO USER TO ENSURE MANGA IS ALREADY IN DATABASE
 */
router.patch('/:title', async (req: express.Request<UserMangaParams>, res) => {
    const { username, title } = req.params;
    const { chapter } = req.body;

    const fetchedManga = await Manga.findOne({ title: title });
    if (!fetchedManga) {
        return res.send({
            message: `manga ${title} does not exist`
        });
    }
    const mangaID = fetchedManga.id;

    try {
        await User.updateOne(
            {
                username: username,
                'mangaList.mangaDetail': mangaID,
            },
            {
                $set: {
                    'mangaList.$.currentChapter': chapter,
                    'mangaList.$.dateRead': new Date,
                },
                $max: {
                    'mangaList.$.highestChapter': chapter
                },
                mangaList: {
                    $sort: { dateRead: -1 }
                },
            },
        );

        return res.send({
            message: `manga ${title} has been sucessfully been updated`
        }).status(201);
    } catch {
        return res.send({
            message: 'there was an error updating user manga'
        }).status(501);
    }
});


/**
 * removes from an user the manga specified
 */
router.delete(`/:title`, async (req: express.Request<UserMangaParams>, res) => {
    const { username, title } = req.params;

    const fetchedManga = await Manga.findOne({ title: title });
    if (!fetchedManga) {
        return res.send({
            message: `manga ${title} does not exist`
        });
    }
    const mangaID = fetchedManga.id;

    try {
        await User.updateOne(
            { username: username },
            {
                $pull: {
                    mangaList: {
                        mangaDetail: mangaID
                    }
                }
            }
        );

        // should be checking if a manga has actually been removed
        return res.send({ 
            message: `user manga ${title} has been removed` 
        }).status(201);
    } catch {
        return res.send({
            message: 'unexpected error removing user manga'
        }).status(501);
    }
});

export default router;
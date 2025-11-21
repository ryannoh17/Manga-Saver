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
    const { title, chapter, url } = req.body;

    try {
        const fetchedManga = await Manga.findOne({ title: title });

        if (!fetchedManga) {
            return res.status(404).send({
                message: `manga ${title} does not exist`
            });
        }

        const mangaID = fetchedManga?._id;

        await User.updateOne(
            { username: username },
            {
                $addToSet: {
                    mangaList: {
                        mangaDetail: mangaID,
                        currentChapter: chapter,
                        highestChapter: chapter,
                        lastReadURL: url
                    }
                }
            }
        ).then((postResult) => {
            if (postResult.modifiedCount === 0) {
                return res.status(410).send({
                    message: 'user manga already exists',
                });
            }
        });

        return res.status(201).send({
            message: `new user manga ${title} added to ${username}`
        });
    } catch (err: any) {
        console.log('error adding new manga to user:', err)
        return res.status(500).send({
            message: 'unexpected error adding user manga',
            details: err
        });
    }
});


// gets the user's manga
router.get('/', async (req: express.Request<UserMangaParams>, res) => {
    const { username } = req.params;

    console.log('getting user manga:', username)

    try {
        let user = await User
            .findOne({ username: username })
            .populate('mangaList.mangaDetail');

        if (!user) return res.status(400).send({
            message: 'user does not exist'
        });

        return res.status(201).send(user.mangaList);
    } catch (err: any) {
        console.log('error getting user manga:', err);
        return res.status(500).send({
            message: 'unexpected error getting user manga',
            details: err
        });
    }

});

/**
 * updates manga information
 * UP TO USER TO ENSURE MANGA IS ALREADY IN DATABASE
 */
router.patch('/:title', async (req: express.Request<UserMangaParams>, res) => {
    const { username } = req.params;
    let { title } = req.params;
    const { chapter, url } = req.body;

    title = title!.replace(/-/g, ' ');
    console.log('updating:', username, title, chapter);

    try {
        // manga exists check
        const fetchedManga = await Manga.findOne({ title: title });
        if (!fetchedManga) {
            console.log(`manga ${title} does not exist`);
            return res.status(404).send({
                message: `manga ${title} does not exist`
            });
        }
        const mangaID = fetchedManga._id;

        // user exists check
        const currentUser = await User.findOne({ username: username });
        if (!currentUser) {
            console.log(`user ${username} does not exist`);
            return res.status(404).send({
                message: `user ${username} does not exist`
            });
        }

        const { mangaList } = currentUser;

        // user manga exists check
        console.log(mangaID.toString());
        const mangaIndex = mangaList.findIndex(
            manga => manga.mangaDetail.toString() === mangaID.toString());
        if (mangaIndex === -1) {
            console.log(`manga ${title} not found in user manga list`);
            return res.status(404).send({
                message: `manga ${title} not found in user manga list`
            });
        }

        // update user manga
        const [currentManga] = mangaList.splice(mangaIndex, 1);
        currentManga.currentChapter = chapter;
        currentManga.highestChapter = Math.max(currentManga.highestChapter, chapter);
        currentManga.lastReadURL = url;
        currentManga.dateRead = new Date();

        mangaList.push(currentManga);
        await currentUser.save();

        return res.status(201).send({
            message: `manga ${title} has been sucessfully been updated`
        });
    } catch (err: any) {
        console.log('user manga update error:', err);
        return res.status(500).send({
            message: 'there was an error updating user manga',
            details: err
        });
    }
});


/**
 * removes from an user the manga specified
 */
router.delete(`/:title`, async (req: express.Request<UserMangaParams>, res) => {
    const { username, title } = req.params;

    console.log('deleting', title, username);

    try {
        const fetchedManga = await Manga.findOne({ title: title });
        if (!fetchedManga) {
            return res.status(404).send({
                message: `manga ${title} does not exist`
            });
        }
        const mangaID = fetchedManga.id;

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
        // what the fuck does this mean
        return res.status(201).send({
            message: `user manga ${title} has been removed`
        });
    } catch (err: any) {
        console.log('error removing user manga', err);
        return res.status(500).send({
            message: 'unexpected error removing user manga',
            details: err
        });
    }
});

export default router;
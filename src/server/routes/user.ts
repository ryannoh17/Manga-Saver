import express from 'express';
import bcrypt from 'bcrypt';
// import { ObjectId } from 'mongoose';
import { User, userType, userMangaType } from '../schemas/user.js';
import { Manga } from '../schemas/manga.js';

const router = express.Router();

/**
 * creates a new user into the database
 * don't allow duplicate usernames
 * don't allow usernames and passwords less than 4 characters
 * sends a message JSON on success or failure
 */

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (username.length < 4)
        return res
            .send({
                message: `username should be at least 4 characters`,
            })
            .status(410);

    if (password.length < 4)
        return res
            .send({
                message: `password should be at least 4 characters`,
            })
            .status(410);

    try {
        const existingUser = await User.findOne({ username: username });
        if (existingUser)
            return res
                .send({
                    message: `username ${username} already exists`,
                })
                .status(401);

        const hashedPassword = await bcrypt.hash(password, 7);
        const newUser = await User.create({
            username: username,
            password: hashedPassword,
        });

        return res
            .send({
                message: `new user ${newUser.username} created`,
            })
            .status(201);
    } catch (error: any) {
        return res
            .send({
                error: 'Failed to create user',
                details: error.message,
            })
            .status(503);
    }
});

/**
 * logs in with given user credentials
 * checks for username to exist
 * sends a JSON message on success or failure
 */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (user === null)
        return res
            .send({
                message: `username ${username} does not exist`,
            })
            .status(401);

    try {
        if (await bcrypt.compare(password, user.password!)) {
            return res.send({ message: 'logged in' }).status(210);
        } else {
            return res.send({ message: 'incorrect password' }).status(411);
        }
    } catch {
        return res.send({ error: 'log in error' }).status(501);
    }
});

// reads user with username
router.get('/:username', async (req, res) => {
    const username = req.params.username;
    const user = await User.find({ username: username });

    return res.send(user).status(200);
});

// // might need this later
// router.get('/:title', async (req, res) => {
//     let foundManga = User.find({ _id: req.params.title });

//     if (!foundManga) {
//         res.send('manga with that title not found').status(405);
//     } else {
//         res.send(foundManga).status(200);
//     }
// });

// // update
// router.patch();

// // delete
// router.delete();

/**
 * creates a new user manga and adds to user manga list
 * checks for duplicate mangas
 * updates chapters if needed (is this bad?)
 */
router.post('/:username/manga', async (req, res) => {
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
                        mangaId: mangaID,
                        currentChapter: chapter,
                        $max: { highestChapter: chapter }
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
                        'mangaList.mangaId': mangaID,
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
            message:
                `new user manga ${title} added to ${username}`
        }).status(201);
    } catch {
        return res.send({
            message:
                'unexpected error adding user manga'
        }).status(501);
    }
});

// rouiter.get();

/**
 * updates manga information
 * UP TO USER TO ENSURE MANGA IS ALREADY IN DATABASE
 *
 */
router.patch('/:username/manga/:title', async (req, res) => {
    const { username, title } = req.params;
    const { chapter } = req.body;

    const fetchedManga = await Manga.findOne({ title: title });

    if (!fetchedManga) {
        return res.send({
            message: `manga ${title} does not exist`
        });
    }

    const mangaID = fetchedManga?.id;

    try {
        const user = await User.findOneAndUpdate(
            {
                username: username,
                'mangaList.mangaId': mangaID,
            },
            {
                $set: {
                    'mangaList.$.currentChapter': chapter,
                    'mangaList.$.dateRead': new Date,
                },
                $max: {
                    'mangaList.$.highestChapter': chapter
                }
            },
        );

        return res.send({
            message:
                `manga ${title} has been sucessfully been updated`
        }).status(201);
    } catch {
        return res.send({
            message: 'there was an error updating user manga'
        }).status(501);
    }
});

export default router;

// once user goes to manga page save it locally
// use that to either create or update
// create will prevent duplicates

// maybe update code so login returns userid and username is not used
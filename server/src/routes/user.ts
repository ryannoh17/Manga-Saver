import express from 'express';
import bcrypt from 'bcrypt';
// import { ObjectId } from 'mongoose';
import { User, userType, userMangaType } from '../schemas/user.js';
import userManga from './userManga.js'

const router = express.Router();
router.use(':username/manga', userManga)

// PREVENT USERNAME DUPLICATES

/**
 * creates a new user into the database
 * don't allow duplicate usernames
 * don't allow usernames and passwords less than 4 characters
 * sends a message JSON on success or failure
 */
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (username.length < 4)
        return res.send({
            message: `username should be at least 4 characters`,
        }).status(410);

    if (password.length < 4)
        return res.send({
            message: `password should be at least 4 characters`,
        }).status(410);

    try {
        const existingUser = await User.findOne({ username: username });
        if (existingUser)
            return res.send({
                message: `username ${username} already exists`,
            }).status(401);

        const hashedPassword = await bcrypt.hash(password, 7);
        const newUser = await User.create({
            username: username,
            password: hashedPassword,
        });

        return res.send({
            message: `new user ${newUser.username} created`,
        }).status(201);
    } catch (error: any) {
        return res.send({
            error: 'Failed to create user',
            details: error.message,
        }).status(503);
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
        return res.send({
            message: `username ${username} does not exist`,
        }).status(401);

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


/**
 * updates a user's username?
 */
router.patch('/:username', async (req, res) => {
    const currentUsername = req.params.username;
    const newUsername = req.body.username;

    try {
        await User.updateOne(
            { username: currentUsername },
            { username: newUsername }
        );

        return res.send({ message: 
            `user ${currentUsername} has been changed to ${newUsername}`
        }).status(201);
    } catch {
        return res.send({ message:
            `an error occured while changing user ${currentUsername}'s username`
        }).status(501);
    }
});


/**
 * deletes user account
 */
router.delete('/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
        await User.deleteOne({ username: username });

        return res.send({
            message: `user ${username} was sucessfully deleted`
        }).status(201);
    } catch {
        return res.send({
            message: `an unexpected error occured while deleting user ${username}`
        }).status(501);
    }
});


export default router;

// maybe update code so login returns userid and username is not used
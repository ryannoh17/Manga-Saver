import express from 'express';
import bcrypt from 'bcrypt';
// import { ObjectId } from 'mongoose';
import { User, userType, userMangaType } from '../schemas/user.js';

const router = express.Router();

// create
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (password.length < 4) {
        return res
            .send({
                error: `password too short`,
            })
            .status(410);
    }

    try {
        const existingUser = await User.findOne({ title: username });
        if (existingUser) {
            return res
                .send({
                    error: `user ${username} already exists in database`,
                })
                .status(401);
        }

        const hashedPassword = await bcrypt.hash(password, 7);
        const newUser = await User.create({
            username: username,
            password: hashedPassword,
        });

        res.send({
            message: `new user ${newUser.username} created`,
        }).status(201);
    } catch (error: any) {
        res.send({
            error: 'Failed to create user',
            details: error.message,
        }).status(503);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });

    if (!user) {
        return res.send(`user ${username} does not exist`);
    }

    try {
        if (await bcrypt.compare(password, user.password!)) {
            res.send({ message: 'logged in' }).status(210)
        } else {
            res.send({ message: 'log in failed' }).status(411)
        }
    } catch {
        res.send({ error: 'log in error' }).status(501)
    }
});

// read
router.get('/', async (req, res) => {
    let mangas = User.find({}).limit(100);

    res.send(mangas).status(200);
});

router.get('/:title', async (req, res) => {
    let foundManga = User.find({ _id: req.params.title });

    if (!foundManga) {
        res.send('manga with that title not found').status(405);
    } else {
        res.send(foundManga).status(200);
    }
});

// // update
// router.patch();

// // delete
// router.delete();

export default router;

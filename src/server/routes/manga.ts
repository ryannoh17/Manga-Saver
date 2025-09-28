import express from 'express';
// import { ObjectId } from 'mongoose';
import { Manga, mangaType } from '../schemas/manga.js';

const router = express.Router();

// create
router.post('/', async (req, res) => {
    try {
        const existingManga = await Manga.findOne({ title: req.body.title });
        if (existingManga) {
            return res.send({
                error: `manga ${existingManga.title} already exists in database`
            }).status(401);
        }

        const newManga = await Manga.create(req.body);
        res.send({
            message: `new manga ${newManga.title} added`
        }).status(201);
    } catch (error: any) {
        res.send({
            error: 'Failed to create manga',
            details: error.message,
        }).status(501).json();
    }
});

// read
router.get('/', async (req, res) => {
    let mangas = await Manga.find({}).limit(100);
    console.log('got manga')

    res.send(mangas).status(202);
});

router.get('/:title', async (req, res) => {
    let foundManga = Manga.find({ _id: req.params.title });

    if (!foundManga) {
        res.send('manga with that title not found').status(405);
    } else {
        res.send(foundManga).status(203);
    }
});

// // update
// router.patch();

// // delete
// router.delete();

export default router;

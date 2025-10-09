import express from 'express';
// import { ObjectId } from 'mongoose';
import { Manga, mangaType } from '../schemas/manga.js';

const router = express.Router();

/**
 * creates a new manga
 * don't allow duplicates
 * returns a JSON message on success or failure
 */
router.post('/', async (req, res) => {
    try {
        const existingManga = await Manga.findOne({ title: req.body.title });
        if (existingManga) {
            return res.send({
                error: `manga ${existingManga.title} already exists in database`
            }).status(401);
        }

        const newManga = await Manga.create(req.body);
        return res.send({
            message: `new manga ${newManga.title} added`
        }).status(201);
    } catch (error: any) {
        return res.send({
            error: 'Failed to create manga',
            details: error.message,
        }).status(501).json();
    }
});

// reads 100 manga from db
router.get('/', async (req, res) => {
    let mangas = await Manga.find({}).limit(100);

    res.send(mangas).status(202);
});

// reads a manga by title
router.get('/:title', async (req, res) => {
    let foundManga = Manga.find({ _id: req.params.title });

    if (!foundManga) {
        return res.send('manga with that title not found').status(405);
    } else {
        return res.send(foundManga).status(203);
    }
});

// // update
// router.patch();

// // delete
// router.delete();

export default router;

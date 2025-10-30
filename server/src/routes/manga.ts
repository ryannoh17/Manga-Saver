import express from 'express';
// import { ObjectId } from 'mongoose';
import { Manga } from '../schemas/manga.js';

const router = express.Router();

/**
 * creates a new manga
 * doesn't allow duplicates
 * returns a JSON message on success or failure
 */
router.post('/', async (req, res) => {
    try {
        const existingManga = await Manga.findOne({ title: req.body.title });
        if (existingManga) {
            return res.status(400).send({
                message: `manga ${existingManga.title} already exists in database`
            });
        }

        const newManga = await Manga.create(req.body);
        return res.status(201).send({
            message: `new manga ${newManga.title} added`
        });

    } catch (err: any) {
        console.log('manga get error: ', err);

        return res.status(500).send({
            message: 'Failed to create manga',
            details: err,
        }).json();
    }
});

// reads 100 manga from db
router.get('/', async (_req, res) => {
    try {
        let mangas = await Manga.find({}).limit(100);
        return res.status(201).send(mangas);
    } catch (err: any) {
        console.log('manga get error: ', err);
        return res.status(500).send({
            message: 'Failed to read manga (limit 100)',
            details: err,
        }).json();
    }
});

// reads a manga by title
router.get('/:title', async (req, res) => {
    try {
        let foundManga = await Manga.find({ _id: req.params.title });

        if (foundManga) {
            return res.send('manga with that title not found').status(405);
        } else {
            return res.send(foundManga).status(203);
        }
    } catch (err: any) {
        console.log('manga get by title error: ', err);
        return res.status(500).send({
            message: 'Failed to get manga by title',
            details: err,
        }).json();
    }

});

// update
// no need for updates so far
// router.patch();

// delete
// no need to delete manga so far
// router.delete();

export default router;

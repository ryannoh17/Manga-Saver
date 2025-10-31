import express from 'express';
import bcrypt from 'bcrypt';
// import { ObjectId } from 'mongoose';
import { User } from '../schemas/user.js';
import userManga from './userManga.js'

const router = express.Router();
router.use('/:username/manga', userManga);

/**
 * creates a new user into the database
 * don't allow duplicate usernames
 * don't allow usernames and passwords less than 4 characters
 * sends a message JSON on success or failure
 */
router.post('/', async (req, res) => {
	const { username, password } = req.body;

	if (username.length < 4)
		return res.status(400).send({
			message: `username should be at least 4 characters`,
		});

	if (password.length < 4)
		return res.status(400).send({
			message: `password should be at least 4 characters`,
		});

	try {
		const existingUser = await User.findOne({ username: username });
		if (existingUser) {
			return res.status(400).send({
				message: `username ${username} already exists`,
			});
		}

		const hashedPassword = await bcrypt.hash(password, 7);
		const newUser = await User.create({
			username: username,
			password: hashedPassword,
		});

		return res.status(201).send({
			message: `new user ${newUser.username} created`,
		});
	} catch (err: any) {
		console.log('user create error: ', err)
		return res.status(500).send({
			message: 'Failed to create user',
			details: err,
		});
	}
});


/**
 * logs in with given user credentials
 * checks for username to exist
 * sends a JSON message on success or failure
 */
router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username: username });

		if (user === null)
			return res.status(404).send({
				message: `username ${username} does not exist`,
			});

		if (await bcrypt.compare(password, user.password!)) {
			return res.status(201).send({ message: 'logged in' });
		} else {
			return res.status(400).send({ message: 'incorrect password' });
		}
	} catch (err: any) {
		console.log('user login error: ', err)
		return res.status(500).send({
			message: 'log in error',
			details: err
		});
	}
});

// reads user with username
router.get('/:username', async (req, res) => {
	const username = req.params.username;

	try {
		const user = await User.find({ username: username });
		if (user) {
			return res.status(201).send(user);
		} else {
			return res.status(400).send({ message: `user ${username} does not exist`});
		}
	} catch (err: any) {
		console.log(`user ${username} read error: `, err);
		return res.status(500).send({
			message: `user ${username} read error`,
			details: err
		});
	}
});


// updates a user's username?
router.patch('/:username', async (req, res) => {
	const currentUsername = req.params.username;
	const newUsername = req.body.username;

	try {
		await User.updateOne(
			{ username: currentUsername },
			{ username: newUsername }
		);

		return res.status(201).send({
			message:
				`user ${currentUsername} has been changed to ${newUsername}`
		});
	} catch (err: any) {
		console.log('username change error', err);
		return res.status(500).send({
			message:
				`an error occured while changing user ${currentUsername}'s username`,
			details: err
		});
	}
});


// deletes user account
router.delete('/:username', async (req, res) => {
	const { username } = req.params;

	try {
		await User.deleteOne({ username: username });

		return res.status(201).send({
			message: `user ${username} was sucessfully deleted`
		});
	} catch (err: any) {
		console.log('user delete error', err);
		return res.status(500).send({
			message: `an unexpected error occured while deleting user ${username}`,
			details: err
		});
	}
});


export default router;

// maybe update code so login returns userid and username is not used
// nah
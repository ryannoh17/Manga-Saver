import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db/conn.js';
import manga from './routes/manga.js';
import user from './routes/user.js';

dotenv.config({ quiet: true });
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({ origin: true, credentials: true}));
app.use(express.json());
app.use('/manga', manga);
app.use('/user', user)

app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.send("An unexpected error occured.").status(500)
})

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

async function startServer() {
    await connectDB();
}
startServer();
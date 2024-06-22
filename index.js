import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
dotenv.config();

const app = express();
connectDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);
app.use('/post', postRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => { console.log(`app is running on server ${PORT}`)});
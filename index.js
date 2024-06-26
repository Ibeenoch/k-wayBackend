import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server} from 'socket.io';
import { connectDb } from './config/db.js';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);
connectDb();

// set io to be access to the controller folder
app.set('io', io);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);
app.use('/post', postRouter);

io.on('connection', (socket) => {
    console.log('new client connected');

    socket.on('disconnect', () => {
        console.log('client disconnected')
    })
})

const PORT = process.env.PORT;
server.listen(PORT, () => { console.log(`app is running on server ${PORT}`)});
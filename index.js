import express from 'express';
import { createServer } from 'node:http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server} from 'socket.io';
import { connectDb } from './config/db.js';
import userRouter from './routes/user.js';
import postRouter from './routes/post.js';
import notificationRouter from './routes/notification.js';
import storyRouter from './routes/story.js';
import chatRouter from './routes/chat.js';
import { Chat } from './model/chat.js';
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST", "PUT",]
    }
});
connectDb();

// set io to be access to the controller folder
app.set('io', io);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/story', storyRouter);
app.use('/notification', notificationRouter);
app.use('/chat', chatRouter);

io.on('connection', (socket) => {
    console.log('new client connected');

    socket.on('joinChat', (roomId) => {
        socket.join(roomId);
        console.log('user joined the chat ', roomId)

    })

    socket.on('sendMessage', async(message) => {
        console.log('message sent ', message);
        const chatId = message.chatId;
        const chat = await Chat.create({
            sender: message.sender,
            receiver: message.receiver,
            message: message.message,
            chatId
        })


        io.to(chatId).emit('receivedMessage', message);
        console.log('message received ', message);
    })


    socket.on('disconnect', () => {
        console.log('client disconnected')
    })
})

const PORT = process.env.PORT;
server.listen(PORT, () => { console.log(`app is running on server ${PORT}`)});
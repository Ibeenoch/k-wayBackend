import express from 'express';
import { protect } from '../middleware/authMiddleWare.js';
import { getChat } from '../controllers/chat.js';
const chatRouter = express.Router();

chatRouter.get('/all/:chatId', protect, getChat);

export default chatRouter;
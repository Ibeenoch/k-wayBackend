import express from 'express';
import { protect } from '../middleware/authMiddleWare.js';
import { findChat, getChat, updateUnReadChat } from '../controllers/chat.js';
const chatRouter = express.Router();

chatRouter.get('/all/:chatId', protect, getChat);
chatRouter.post('/find', protect, findChat);
chatRouter.put('/:chatId', protect, updateUnReadChat);

export default chatRouter;
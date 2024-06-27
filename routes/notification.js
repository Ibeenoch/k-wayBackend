import express from 'express';
import { getANotification, getNotifications } from '../controllers/notification.js';
import { protect } from '../middleware/authMiddleWare.js';
const notificationRouter = express.Router();

notificationRouter.get('/all', protect, getNotifications);
notificationRouter.get('/:id', protect, getANotification);

export default notificationRouter;
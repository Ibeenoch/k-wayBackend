import express from 'express';
import { getANotification, getNotificationsOfAUser,  } from '../controllers/notification.js';
import { protect } from '../middleware/authMiddleWare.js';
const notificationRouter = express.Router();

notificationRouter.get('/user/:userId', protect, getNotificationsOfAUser);
notificationRouter.get('/:id', protect, getANotification);

export default notificationRouter;
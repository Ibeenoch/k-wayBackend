import express from 'express';
import { getANotification, getNotificationsOfAUser, markNotificationsAsViewed,  } from '../controllers/notification.js';
import { protect } from '../middleware/authMiddleWare.js';
const notificationRouter = express.Router();

notificationRouter.get('/:userId/:postId', protect, getNotificationsOfAUser);
notificationRouter.put('/:userId/:postId', protect, markNotificationsAsViewed);
notificationRouter.get('/:id', protect, getANotification);

export default notificationRouter;
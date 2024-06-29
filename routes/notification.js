import express from 'express';
import { getANotification, getNotificationsOfAUser, markNotificationsAsViewed,  } from '../controllers/notification.js';
import { protect } from '../middleware/authMiddleWare.js';
const notificationRouter = express.Router();

notificationRouter.get('/:userId', protect, getNotificationsOfAUser);
notificationRouter.put('/:userId', protect, markNotificationsAsViewed);
notificationRouter.get('/:id', protect, getANotification);

export default notificationRouter;
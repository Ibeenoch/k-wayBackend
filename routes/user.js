import express from 'express';
import { changePassword, editProfile, login, recoveryEmailLink, register, userFollowers, userFollowing, verifyEmail } from '../controllers/user.js';
import { protect } from '../middleware/authMiddleWare.js';
import upload from '../middleware/fileMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', register );
userRouter.post('/login', login );
userRouter.post('/verify', verifyEmail );
userRouter.post('/password/recovery', recoveryEmailLink );
userRouter.put('/password/reset/:id', changePassword );
userRouter.put('/update/:id', protect, upload.single('image'), editProfile );
userRouter.put('/follower/:userId', protect, userFollowers );
userRouter.put('/following/:userId', protect, userFollowing );

export default userRouter;
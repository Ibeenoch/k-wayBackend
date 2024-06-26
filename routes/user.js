import express from 'express';
import { changePassword, editProfile, followAndUnfollow, getAUser, getAllUsers, getFollowers, getFollowing, login, recoveryEmailLink, register, verifyEmail } from '../controllers/user.js';
import { protect } from '../middleware/authMiddleWare.js';
import upload from '../middleware/fileMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register', register );
userRouter.post('/login', login );
userRouter.post('/verify', verifyEmail );
userRouter.post('/password/recovery', recoveryEmailLink );
userRouter.put('/password/reset/:id', changePassword );
userRouter.put('/update/:id', protect, upload.single('image'), editProfile );
userRouter.put('/follower/:userId', protect, followAndUnfollow );
userRouter.put('/following/:userId', protect, followAndUnfollow );
userRouter.get('/following', protect, getFollowing );
userRouter.get('/followers', protect, getFollowers );
userRouter.get('/', getAllUsers );
userRouter.get('/:userId', getAUser );

export default userRouter;
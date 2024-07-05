import express from 'express';
import { changePassword, editProfile, followAndUnfollow, getAUser, getAllUsers, getFollowers, getFollowing, getTopUserTrending, login, recoveryEmailLink, register, searchUser, verifyEmail } from '../controllers/user.js';
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
userRouter.get('/following/:userId',  getFollowing );
userRouter.get('/followers/:userId',  getFollowers );
userRouter.get('/searchuser', searchUser );
userRouter.get('/', getAllUsers );
userRouter.get('/trending', getTopUserTrending );
userRouter.get('/:userId', getAUser );

export default userRouter;
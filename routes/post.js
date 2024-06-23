import express from 'express';
import { protect } from '../middleware/authMiddleWare.js';
import upload, { multiUpload } from '../middleware/fileMiddleware.js';
import { allPostComments, bookmarkPost, commentPost, createPost, deleteAPost, deleteCommentPost, editCommentPost, getAllPosts, likePost, rePost, replyCommentPost, updatePost } from '../controllers/post.js';

const postRouter = express.Router();

postRouter.post('/create', protect, multiUpload, createPost );
postRouter.put('/update/:id', protect, multiUpload, updatePost );
postRouter.put('/like/:id/:userId', protect,  likePost );
postRouter.put('/bookmark/:id/:userId', protect,  bookmarkPost );
postRouter.put('/reshare/:id/:userId', protect,  rePost );
postRouter.post('/replycomment/:id/:commentId/:userId', protect,  replyCommentPost );
postRouter.put('/updatecomment/:id/:commentId', protect,  editCommentPost );
postRouter.delete('/deletecomment/:id/:commentId', protect,  deleteCommentPost );
postRouter.post('/comment/:id/:userId', protect,  commentPost );
postRouter.get('/comment/:id', allPostComments );
postRouter.delete('/delete/:id', protect,  deleteAPost );
postRouter.get('/all', getAllPosts );

export default postRouter;
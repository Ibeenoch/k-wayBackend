import express from 'express';
import { protect } from '../middleware/authMiddleWare.js';
import upload, { multiUpload } from '../middleware/fileMiddleware.js';
import { allPostComments, allRepliesForAComment, bookmarkPost, commentPost, createPost, deleteAPost, deleteCommentPost, editCommentPost, getAPost, getAllPosts, getBookmark, getLikes, getReshare, likeAComment, likePost, rePost, replyCommentPost, updatePost } from '../controllers/post.js';

const postRouter = express.Router();

postRouter.post('/create', protect, multiUpload, createPost );
postRouter.put('/update/:id', protect, multiUpload, updatePost );
postRouter.put('/like/:id/:userId', protect,  likePost );
postRouter.put('/bookmark/:id/:userId', protect,  bookmarkPost );
postRouter.put('/reshare/:id/:userId', protect,  rePost );
postRouter.post('/replycomment/:commentId', protect,  replyCommentPost );
postRouter.get('/replies/:commentId',  allRepliesForAComment );
postRouter.put('/updatecomment/:commentId', protect,  editCommentPost );
postRouter.put('/likecomment/:commentId', protect,  likeAComment );
postRouter.delete('/deletecomment/:id/:commentId', protect,  deleteCommentPost );
postRouter.post('/comment/:id/:userId', protect,  commentPost );
postRouter.get('/comment/:id', allPostComments );
postRouter.get('/single/:id', getAPost );
postRouter.delete('/delete/:id', protect,  deleteAPost );
postRouter.get('/all', getAllPosts );
postRouter.get('/getlikes/:postId', getLikes );
postRouter.get('/getbookmark/:postId', getBookmark );
postRouter.get('/getreshare/:postId', getReshare );

export default postRouter;
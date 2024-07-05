import express from 'express';
import { protect } from '../middleware/authMiddleWare.js';
import upload, { multiUpload } from '../middleware/fileMiddleware.js';
import { allPostComments, allPostsForAUser, allRepliesForAComment, bookmarkPost, commentPost, createPost, deleteAPost, deleteCommentPost, editCommentPost, getAPost, getAllPosts, getBookmark, getLikes, getReshare, getTopTrendingPost, likeAComment, likePost, rePost, replyCommentPost, searchPost, updatePost } from '../controllers/post.js';

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
postRouter.get('/searchpost', searchPost );
postRouter.get('/single/:id', getAPost );
postRouter.get('/user/:userId', allPostsForAUser );
postRouter.delete('/delete/:id', protect,  deleteAPost );
postRouter.get('/all', getAllPosts );
postRouter.get('/trending', getTopTrendingPost );
postRouter.get('/getlikes/:postId', getLikes );
postRouter.get('/getbookmark/:postId', getBookmark );
postRouter.get('/getreshare/:postId', getReshare );

export default postRouter;
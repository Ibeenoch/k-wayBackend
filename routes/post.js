import express from 'express';
import { protect } from '../middleware/authMiddleWare.js';
import upload, { multiUpload } from '../middleware/fileMiddleware.js';
import { createPost, deleteAPost, getAllPosts, updatePost } from '../controllers/post.js';

const postRouter = express.Router();

postRouter.post('/create', protect, multiUpload, createPost );
postRouter.put('/update/:id', protect, multiUpload, updatePost );
postRouter.delete('/delete/:id', protect,  deleteAPost );
postRouter.get('/all', getAllPosts );

export default postRouter;
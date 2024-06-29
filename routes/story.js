import express from 'express';
import { addStory, getAllStoriesForAUser, getAvailableStories } from '../controllers/story.js';
import { multiUpload } from '../middleware/fileMiddleware.js';
import { protect } from '../middleware/authMiddleWare.js';
const storyRouter = express.Router();

storyRouter.post('/create', protect, multiUpload, addStory );
storyRouter.get('/available',  getAvailableStories);
storyRouter.get('/all/:userId',  getAllStoriesForAUser);


export default storyRouter;
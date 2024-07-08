import mongoose, { Schema } from "mongoose";

const storycommentSchema = new Schema({
    owner:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photos: [],
    video: {},
    content: {
        type: String,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    count: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
})



const storySchema = new Schema({
    content: {
        type: String,
    },
    photos: [],
    video: {},
    views: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'StoryComment'
        }],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],  
   
      
}, {
    timestamps: true,
});

export const StoryComment = mongoose.model('StoryComment', storycommentSchema);
export const Story = mongoose.model('Story', storySchema);
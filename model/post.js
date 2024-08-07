import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    owner:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    content: {
        type: String,
        required: true,
    },
    privacy: {
        type: String,
        default: 'public'
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
}, {
    timestamps: true,
})


const postSchema = new Schema({
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
            ref: 'Comment'
        }],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],  
    allReshare:  [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],  
    reShared: {
        type: Boolean,
        default: false
    },
    reShare: {
        type: [{
           user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
          post:  {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
            }
        }],
        default: []
    },    
    bookmark: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],    
}, {
    timestamps: true,
});

postSchema.index({
    content: 'text'
})

export const Comment = mongoose.model('Comment', commentSchema);
export const Post = mongoose.model('Post', postSchema);
import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    sender:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isviewed: {
        type: Boolean,
        default: false,
    }
  
}, {
    timestamps: true,
});

export const Notification = mongoose.model('Notification', notificationSchema);
import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true,
    },
    posts:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    sender: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    receiver: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true,
});

export const Notification = mongoose.model('Notification', notificationSchema);
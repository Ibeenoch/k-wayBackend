import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
   
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
    },
    handle: {
        type: String,
    },
    fullname: {
        type: String,
    },
    profession: {
        type: String,
    },
    dateOfBirth: {
        type: String,
    },
    bio: {
        type: String,
    },
    posts:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    }],
    stories:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
    }],
    notification:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
    }],
    profilePhoto: {
        url: String,
        public_id: String,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true,
});

userSchema.index({
    fullname: 'text', bio: 'text', handle: 'text', profession: 'text'
})

export const User = mongoose.model('User', userSchema);
import mongoose, { Schema } from "mongoose";

const chatIdSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    myId: {
        type: String,
        required: true,
    },
  
}, {
    timestamps: true,
});

export const ChatId = mongoose.model('ChatId', chatIdSchema);
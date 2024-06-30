import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    message: {
        type: String,
        required: true,
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
    },
    chatId: {
        type: String,
    }
  
}, {
    timestamps: true,
});

export const Chat = mongoose.model('Chat', chatSchema);
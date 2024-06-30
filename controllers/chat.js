import { Chat } from "../model/chat.js";

export const getChat = async(req, res) => {
try {
    console.log(req.params)
  const chats = await Chat.find({ chatId: req.params.chatId }).populate('sender receiver').sort('timestamp');
  console.log('all prev chat ', chats);
  res.status(200).json(chats);
} catch (error) {
    res.status(500).json({ message: error });
    console.log(error)
}
}
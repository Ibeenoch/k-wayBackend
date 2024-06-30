import { Chat } from "../model/chat.js";
import { ChatId } from "../model/chatId.js";

export const findChat = async(req, res) => {
try {
    console.log(req.body)
  const chatId = await ChatId.find();

  if(chatId.length < 1){
      const newChatId = await ChatId.create({
        userId: req.body.userId,
        myId: req.body.myId,
      });

      console.log('the chatid ', newChatId);
     res.status(201).json(newChatId._id);
     return;
  }

  const findChatId = chatId.find((c) => {
    if((c.userId === req.body.userId && c.myId === req.body.myId) || (c.myId === req.body.userId && c.userId === req.body.myId)){
      return true;
    }
  })
  res.status(200).json(findChatId._id);

} catch (error) {
    res.status(500).json({ message: error });
    console.log(error)
}
}

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
import { Chat } from "../model/chat.js";
import { ChatId } from "../model/chatId.js";

export const findChat = async(req, res) => {
try {
  const chatId = await ChatId.find();
  console.log('chatId ', chatId)

  if(chatId === null || chatId === undefined || chatId.length < 1){
      const newChatId = await ChatId.create({
        userId: req.body.userId,
        myId: req.body.myId,
      });

      if(newChatId){
        console.log('the chatid ', newChatId);
        res.status(201).json(newChatId._id);
        return;
      }
      
  }else{



  const findChatId = chatId.find((c) => {
    if((c.userId === req.body.userId && c.myId === req.body.myId) || (c.myId === req.body.userId && c.userId === req.body.myId)){
      return true;
    }
  });

              if(findChatId === undefined){
                const newChatId = await ChatId.create({
                  userId: req.body.userId,
                  myId: req.body.myId,
                });

                if(newChatId){
                  console.log('the chatid ', newChatId);
                  res.status(201).json(newChatId._id);
                  return;
                }
              }

  console.log('the findChatId ', findChatId);

  res.status(200).json(findChatId._id);
};

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
  const count = await Chat.countDocuments({
    chatId: req.params.chatId,
    isviewed: false,
  })

  res.status(200).json({chats, count});
} catch (error) {
    res.status(500).json({ message: error });
    console.log(error)
}
}

export const updateUnReadChat = async (req, res) => {
  try {
    const markUnreadChat = await Chat.updateMany({
      chatId: req.params.chatId, isviewed: false,
    }, {
      $set: { isviewed: true },
    })
    const countReadChat = await Chat.countDocuments({
      chatId: req.params.chatId,
      isviewed: false,
    })

    res.status(200).json(countReadChat)
  } catch (error) {
    res.status(500).json({ message: error });
    console.log(error)
  }
}
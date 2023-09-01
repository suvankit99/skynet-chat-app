const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, messageContent } = req.body;
  // check if either of these is not provided
  if (!chatId) {
    throw "Chat Id not sent for message to be stored";
    return res.status(400);
  }

  if (!messageContent) {
    throw "No message content provided";
    return res.status(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: messageContent,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    // populate sender and chat fields in the message object
    message = await message.populate([
      { path: "sender", select: "name pic" },
      { path: "chat" },
    ]);
    // populate the users array field inside the chat field of this message object
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    // update the latest message inside the chat object which is referred above
    await Chat.updateOne({_id : chatId} , { $set : { latestMessage : message }}) ;

    res.status(200).json(message);

  } catch (error) {

    res.status(400);
    throw error.message;
  }
});

const getAllMessages = asyncHandler(async (req , res) => {
    const { chatId } = req.params ; 
    
    try {
        const messages = await Message.find({chat : chatId}).populate("sender" , "name pic").populate("chat") ;
        res.status(200).send(messages) ;
    } catch (error) {
        res.status(400) ;
        throw error.message ;
    }
})
module.exports = { sendMessage , getAllMessages };

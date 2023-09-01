const { Schema } = require('mongoose')
const mongoose = require('mongoose') 

// Creating chat schema 
const chatSchema = new Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    // users array stores a multiple user object id's 
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // latest message stores a message object id 
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    // group admin store an user object id 
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true })


// exporting the chats model , which will be used for chat instances / documents 
module.exports = mongoose.model("Chat" , chatSchema) 
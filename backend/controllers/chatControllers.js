const express = require("express");
const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// This function will be used to retrieve a particular one-on-one chat
const accessChat = asyncHandler(async (req, res) => {
  // for creating the 1v1 chat , the logged user will send the userId of the user which he wants to chat
  // with, to the backend

  console.log(req.body);
  // extract the userId
  const { userId } = req.body;

  // if no userID received throw error
  if (!userId) {
    throw "UserId param not sent with request";
    return res.sendStatus(400);
  }

  // First we check if a given chat already exists

  let isChat = await Chat.find({
    isGroupChat: false, // it must be a 1v1 chat
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, // Both the logged user and userId user must be there
      { users: { $elemMatch: { $eq: userId } } },
      // The $elemMatch operator matches documents that contain an array field with at least one
      // element that matches all the specified query criteria.
    ],
  })
    .populate("users", "-password") // fill up the users array in chats , but don't include the password
    .populate("latestMessage"); // also fill up the latest message field with the message object

  // Now we fill up the "sender" field of the latest message since message object
  // has an user object id in the sender field
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email", // We will include these user fields to be included in sender field of the lateest message
  });

  // isChat will be an array of chat objects , but since we are dealing with 1v1 chats ,
  // it will contain only 1 element
  if (isChat.length > 0) {
    // if we find a valid chat then return it
    console.log("Chat found");
    res.send(isChat[0]);
  } else {
    // otherwise we create a new chat
    console.log("Creating new chat");
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    // Here we actually create the chat object using the chatData
    try {
      const createdChat = await Chat.create(chatData);
      // right now createdChat has only user object id's in the users array field
      // so we populate that users field with complete data of those 2 users
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const getAllChats = asyncHandler(async (req, res) => {
  try {
    // get all the chats the logged user is part of
    let chatsUserIsPartOf = Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    });
    
    chatsUserIsPartOf
      .populate("users", "-password") // populate the users
      // .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  // taking input for the groupchat name and array of user object id's
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  let userList = JSON.parse(req.body.users);

  if (userList.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  userList.push(req.user); // include the logged user in the group

  try {
    // create a chat object in the database for this group
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: userList,
      isGroupChat: true,
      groupAdmin: req.user, // making the logged user as the admin by default
      // since the logged user is creating the group
    });

    let createdGroup = await Chat.findOne({ _id: groupChat._id }); // fetching the group chat just created from the database
    console.log(createdGroup);
    // filling up users list by the actual user objects
    let fullGroupChat = await User.populate(createdGroup, {
      path: "users",
      select: "-password",
    });
    // populating group admin field
    fullGroupChat = await User.populate(fullGroupChat, {
      path: "groupAdmin",
      select: "-password",
    });
    // send back the complete group information
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw error.message;
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const chatId = req.body.chatId;
  const newGroupName = req.body.name;

  let updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: newGroupName },
    { new: true }
  );
  // Now we populate both users and group admin fields
  let fullUpdatedGroup = await (
    await Chat.populate(updatedGroup, { path: "users", select: "-password" })
  ).populate("groupAdmin", "-password");

  if (!updatedGroup) {
    res.status(400);
    throw "Could not rename group";
  } else {
    res.status(200).json(fullUpdatedGroup);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  // Taking the input of chatId of the group chat where we will add this user with this userId
  const chatId = req.body.chatId;
  const userId = req.body.userId;
  
  const addedToGroup = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } }, // pushing this userId to the users field 
    { new: true } 
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedToGroup) {
    res.status(400);
    throw "Could not add new member to group";
  } else {
    res.status(200).json(addedToGroup);
  }
});

const removeFromGroup = asyncHandler(async (req , res) => {
  const chatId = req.body.chatId;
  const userId = req.body.userId;
  
  const removedFromGroup = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } }, // pushing this userId to the users field 
    { new: true } 
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removedFromGroup) {
    res.status(400);
    throw "Could not remove member from group";
  } else {
    res.status(200).json(removedFromGroup);
  }
})
module.exports = {
  accessChat,
  getAllChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup
};

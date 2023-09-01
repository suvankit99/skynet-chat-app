const express = require('express')
const {protect} = require('../middleware/authMiddleware');
const { accessChat, getAllChats, createGroup, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatControllers');
const router = express.Router() 

router.post( "/" , protect , accessChat) ; // creating a 1v1 chat
router.get( "/" , protect , getAllChats) ; // for getting all the chats for a user
// Since we are creating a new group we will need to send info to backend so it will be a post request 
router.route("/group").post(protect , createGroup) ;
// // All the following operations are update opterations , so they will be put requests 
router.route("/rename").put(protect , renameGroup) ;
router.route("/groupadd").put(protect , addToGroup) ;
router.route("/groupremove").put(protect , removeFromGroup) ;
module.exports = router ;
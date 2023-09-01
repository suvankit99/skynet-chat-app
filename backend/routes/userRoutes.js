const express = require('express')
const {registerUser , authUser , allUsers, resetPassword, updatePassword } = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');
const router = express.Router() 

// sign up route 
router.route("/").post(registerUser).get(protect , allUsers) ;

// // login route

router.post("/login" , authUser)  ;

// Reset password route 
router.put("/new-password/" , updatePassword);
router.post("/reset-password" , resetPassword) ;

module.exports = router ;
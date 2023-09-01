const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization ;
  if (
    authHeader &&
    authHeader.startsWith("Bearer")
  ) {
    try {
      const authHeaderList = authHeader.split(" ") ;
      token = authHeaderList[1];
      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Here we are adding a user key in our req object which will further be passed down to allusers 
      // function in userControllers . The allusers function will use this "user" property of the 
      // req object to get the id of current logged user , and use it to exclude it from search results 
      // Thereby we are performing authorization by determining access levels using jwt 
      
      req.user = await User.findById(decoded.id).select("-password"); // get all details except password

      next();
    } catch (error) {
      res.status(401);
      throw "Not authorized, token failed";
    }
  }

  if (!token) {
    res.status(401);
    throw "Not authorized, no token";
  }
});

module.exports = { protect };
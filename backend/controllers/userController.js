const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// it handles all the errors related to async requests
const asyncHandler = require("express-async-handler");

// Registering new user along with password encryption
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password || !pic) {
    res.status(400);
    throw "Cannot get user data";
  }

  const userFound = await User.findOne({ email });
  if (userFound) {
    res.status(400);
    throw "An user with this email already exists";
  } else {
    // if this email hasn't been used , then we create a new user with this email
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
      pic: pic,
    });
    // if user successfully created we send it as response
    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      throw "User could not be created";
    }
  }
});

// User authentication for login
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const foundUser = await User.findOne({ email: email });
  const passwordMatchOccured = bcrypt.compare(password, foundUser.password);

  // if the entered credentials match with an user in our database then we allow the user
  if (foundUser && passwordMatchOccured) {
    console.log(`Login successful for ${foundUser.name}`);
    res.status(200).json({
      _id: foundUser._id,
      name: foundUser.name,
      email: foundUser.email,
      pic: foundUser.pic,
      token: generateToken(foundUser._id),
    });
  } else {
    throw "Invalid Login credentials";
  }
});

// To get the data of all users we will use query strings
// Ex -> https://localhost/5000/api/chat/user?name=Suvankit
// In the above example , everything after the ? is part of the query string
// Query string comprises of key value pairs sparated by =
// But path parameters are different from query parameters
// Path parameters are those that appear before ? and are defined using : ,
// and query parameters appear after the ?
// Ex - https://localhost/5000/api/chat/:userId?name=Suvankit ,userId is path parameter and
// name is a query parameters .

// To access query parameters  => req.query
// to access path/route parameters => req.params

const allUsers = asyncHandler(async (req, res) => {
  // To access query parameters in our url , we use req.query
  const searchKeyWord = req.query.search;
  // We check if we have something in the query string or not
  if (searchKeyWord) {
    // we make a query to the databse to find all users with that name
    // we use regular expressions to make case insenstive matching i.e. SaHOO , sahoo , SahoO all are same
    const userMatchQuery = {
      $or: [
        { email: { $regex: searchKeyWord, $options: "i" } },
        { name: { $regex: searchKeyWord, $options: "i" } },
      ],
    };
    const excludeLoggedUserQuery = { _id: { $ne: req.user._id } };

    // Currently our "usersFound" list contains all the users matching our search conditions ,
    // but includes the current user too so we have to remove that entry from our "usersfound" list
    const usersFound = await User.find(userMatchQuery).find(
      excludeLoggedUserQuery
    );
    console.log(req.user);
    // If we get some users we send it
    if (usersFound.length !== 0) {
      res.send(usersFound);
    } else {
      // otherwise it means there is no such user matching the given search parameters
      res.status(400).json({
        error: "No such user found",
      });
    }
  } else {
    res.status(401).json({
      error: "Invalid query string",
    });
  }
});

const SENDMAIL = async (transporter, mailDetails, callback) => {
  try {
    const info = await transporter.sendMail(mailDetails);
    callback(info);
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).send("No email provided");
    return;
  }
  const foundUser = await User.findOne({ email: email });
  if (!foundUser) {
    res.status(400).send("No such user exists with this email");
    return;
  } else {
    // if user exists with this email

    // create a one time password reset link using jwt

    const secret = process.env.JWT_SECRET + foundUser.password;
    const data = {
      id: foundUser._id,
      email: foundUser.email,
    };
    const token = jwt.sign(data, secret, { expiresIn: "15m" });
    const link = `https://sky-net-app.onrender.com/new-password/`;

    // send the link via email

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "testingapp240@gmail.com",
        pass: process.env.NODE_MAILER_PASS, // put this in env file
      },
    });

    transporter
      .verify()
      .then(console.log("transporter verified"))
      .catch(console.error);

    const message = link;
    const options = {
      from: "<testingapp240@gmail.com>", // sender address
      to: email, // receiver email
      subject: "SkyNet : Password reset link ", // Subject line
      text: message,
    };

    SENDMAIL(transporter, options, (info) => {
      console.log("Email sent successfully");
      console.log("MESSAGE ID: ", info.messageId);
    });

    res.json({
      id: foundUser._id,
      token: token,
    });
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { id, token, newPassword } = req.body;
  // check if id exists in DB
  const foundUser = await User.findById(id);
  if (!foundUser) {
    res.status(400).send("Invalid User ID");
    return;
  } else {
    const secret = process.env.JWT_SECRET + foundUser.password;

    // hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const encryptedNewPassword = await bcrypt.hash(newPassword, salt);
    try {
      const data = jwt.verify(token, secret);
      const updatedUser = await User.updateOne(
        { _id: id },
        { $set: { password: encryptedNewPassword } }
      );
      res.send(updatedUser);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
});
module.exports = {
  registerUser,
  authUser,
  allUsers,
  resetPassword,
  updatePassword,
};

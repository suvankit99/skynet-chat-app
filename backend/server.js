// importing stuff
// const {Server} = require('socket.io')
const express = require('express') ;
const dotenv = require('dotenv') ;
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require("./routes/messageRoutes")
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path")

// configure dot env files 
dotenv.config() 

// connecting to database 
const connectDB = require("./config/db")
connectDB()

// Initialize app 
const app = express() ;

// Port number where the app will listen for requests 
const PORT = process.env.PORT;

// It tells the server to parse / accept external json data
app.use(express.json());

// fallback function for invalid paths in url 
const invalidPathHandler = (req, res, next) => {
    res.status(404).json({
        error : "Invalid Path"
    })
  }

// managing user routes using express router

app.use("/api/users/" , userRoutes)
app.use("/api/chats/" , chatRoutes)
app.use("/api/messages" , messageRoutes) ;


// ****************************DEPLOYMENT******************************

const currDirectory = path.resolve()
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(currDirectory , "/frontend/build")))
    app.get("*" , (req , res) => {
        res.sendFile(path.resolve(currDirectory , "frontend" , "build" , "index.html"))
    })
}

    app.get("/" , (req,res) => {
        res.send("App is not in production mode")
    })


// ****************************DEPLOYMENT******************************

// Error handling for invalid paths 
app.use(invalidPathHandler)

// server listening for requests on this port 
const server = app.listen(PORT , () => {
    console.log(`server listening on port ${PORT}`) ;
})

const io = require('socket.io')(server , {
    /*t a given interval (the pingInterval value sent in the handshake)
     the server sends a PING packet and the client has a few seconds (the pingTimeout value) 
     to send a PONG packet back. If the server does not receive a PONG packet back, 
     it will consider that the connection is closed. Conversely, if the client does not receive a PING packet 
     within pingInterval + pingTimeout, it will consider that the connection is closed */

    pingTimeout : 60000 , 
    cors : {
        origin : "http://localhost:3000" // now our server acccepts https requests from client which is located at localhost:3000
    }
})


io.on("connection", (socket) => {
    console.log("Connected to socket.io" , socket.id) ;
    // As soon as user logs in , its own socket must be up 
    socket.on("setup-room" , (userData) => {
        socket.join(userData._id) ;
        socket.emit("connected")
    })
    // whenever the logged user clicks on a chat , the logged user and other user (whose chat is clicked) will be put in one room
    socket.on('join chat' , (room) => {
        socket.join(room._id) ;
        console.log("user joined room : " , room._id ) ;
    })

    socket.on("typing" , (room) => socket.to(room._id).emit("typing")) ;
    
    socket.on("stop typing" , (room) => socket.to(room._id).emit("stop typing")) ;

    socket.on('send message' , (messageRecevived) => {
        const chat = messageRecevived.chat ;
        if(!chat.users){
            return console.log("Chat.users not defined") ;
        }
        // send the message to all the users in the room except yourself 
        chat.users.map((user) => {
            if(user._id === messageRecevived.sender._id){
                return ;
            }
            socket.to(user._id).emit("message received" , messageRecevived) ;
        })
    })

    socket.off("setup-room" , (room) => {
        console.log("User disconnected") ;
        socket.leave(room._id)
    })
});

import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  background,
  useStatStyles,
  useToast,
} from "@chakra-ui/react";
import { getSender, getSenderObject } from "../../config/ChatLogics";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../Miscellaneous/ProfileModal";
import UpdateGroupModal from "../Miscellaneous/UpdateGroupModal";
import axios from "axios";
import ScrollableMessage from "../Miscellaneous/ScrollableMessage";
import { io } from "socket.io-client";
import SendIcon from '@mui/icons-material/Send';
import { Icon } from "@chakra-ui/react";

const ENDPOINT = "https://skynet-chat-app-free.onrender.com";
// where our server is present , since it is at a different URL we enable CORS on server side
// which means server can accept requests from other URLs as well
let socket;
let selectedChatCompare;

const SingleChat = () => {
  const { selectedChat, setSelectedChat, user , fetchAgain , setFetchAgain , notifications , setNotifications} = ChatState();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setnewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  //
  useEffect(() => {
    socket = io(ENDPOINT); // client socket initialized
    socket.emit("setup-room", user); // send a request to server socket to setup a room
    // on receiving connected request from the server
    socket.on("connected", () => {
      console.log("Room connected");
      setSocketConnected(true);
    });

    socket.on("typing", () => { setIsTyping(true);});
    socket.on("stop typing", () => { setIsTyping(false);});


  }, []);

  const typingHandler = (event) => {
    setnewMessage(event.target.value);
    if(!socketConnected) return ;

    if(!typing){
      setTyping(true) ;
      socket.emit("typing" , selectedChat)
    }
    let lastTypingTime = new Date().getTime() ;
    const timeOutInterval = 2000 ; 
    setTimeout(() => {
      let timeNow = new Date().getTime() ;
      let timeDiff = timeNow - lastTypingTime ;
      if(timeDiff >= timeOutInterval && typing){
        socket.emit("stop typing" , selectedChat) ;
        setTyping(false) ;
      }
    }, timeOutInterval);
  };


  const getAllMessages = async () => {
    if (Object.keys(selectedChat).length !== 0) {
      try {
        setLoading(true);

        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
          `/api/messages/${selectedChat._id}`,
          config
        );

        setMessages([...data]);

        setLoading(false);

        // after fetching all the messages successfully , we make a request to the server to join a room
        socket.emit("join chat", selectedChat);
      } catch (error) {
        setLoading(false);
        toast({
          title: "Error Occured!",
          description: "Failed to get all the messages",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing" , selectedChat) ;
      try {
        const copyNewMessage = newMessage;
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewMessage("");

        const { data } = await axios.post(
          "/api/messages/",
          { chatId: selectedChat._id, messageContent: copyNewMessage },
          config
        );
        // emit this message to the server
        socket.emit("send message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain) ;
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the message",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // Whenever user switches to a new chat i.e. selectedchat changes fetch all the messages
  useEffect(() => {
    if (Object.keys(selectedChat).length !== 0) {
      getAllMessages();
    }
    // storing back up of the selected chat in selectedchatcompare , so that we can decide whether to emit the message or just send the notification
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        // give only notification
        if(!notifications.includes(newMessage)){
          setNotifications([newMessage , ...notifications]) ;
          setFetchAgain(!fetchAgain) ;
          
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });

  console.log(notifications) ;
  // Correct way of checking if an object is empty using Object.keys method
  if (Object.keys(selectedChat).length !== 0) {
    return (
      <>
        <Text
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          fontSize={{ base: "28px", md: "30px" }}
          paddingBottom={3}
          paddingX={2}
          width="100%"
          fontFamily="Work sans"
          color={"white"}
        >
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat("")}
          />
          {/* Displaying name of the chat , either 1v1 or group chat */}
          {!selectedChat.isGroupChat ? (
            <>{getSender(user, selectedChat.users)}</>
          ) : (
            selectedChat.chatName
          )}
          {/* Displaying updateGroupModal for a group chat and a profile modal for a 1v1 chat  */}
          {!selectedChat.isGroupChat ? (
            <ProfileModal user={getSenderObject(user, selectedChat.users)} />
          ) : (
            <UpdateGroupModal getAllMessages={getAllMessages} />
          )}
        </Text>
        {/* Chat Body  */}
        <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          padding={3}
          background="#202329"
          width="100%"
          height="90%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {loading ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.600"
              size="xl"
              alignSelf={"center"}
              marginBottom={"25%"}
            />
          ) : (
            <>
              <Box display={"flex"} flexDir={"column"} overflowY={"scroll"} background={"#393E46"} height={"100%"} padding={"3"} borderRadius={"10px"}>
                <ScrollableMessage messages={messages} />
              </Box>
              <FormControl onKeyDown={sendMessage} >

                {isTyping && <div style={{color:"white"}}>typing...</div> }
                <Input
                  placeholder="Enter message"
                  size={"md"}
                  background={"#2E333D"}
                  color={"white"}
                  value={newMessage}
                  onChange={typingHandler}
                  marginTop={2}
                ></Input>
                
              </FormControl>
            </>
          )}
        </Box>
      </>
    );
  } else {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent={"center"}
        height="100%"
        background={"#393E46"}
        borderRadius={"10px"}
      >
        <Text fontSize="3xl" paddingBottom={3} fontFamily="Work sans" color={"white"}>
          Click on a user to start chatting !
        </Text>
      </Box>
    );
  }
};

export default SingleChat;

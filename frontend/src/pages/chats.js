import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../context/chatProvider";
import SideDrawer from "../components/Chat components/SideDrawer";
import MyChats from "../components/Chat components/MyChats";
import ChatBox from "../components/Chat components/ChatBox";
import { Box } from "@chakra-ui/react";
const Chats = () => {
  //   // We also need to store the received data , so we will store it in a state
  //   const [chats , setChats] = useState([]) ;
  //   // this fetch chats function will get the chats data from the api / backend
  //   // We have set the proxy to the backend's local host address (port 5000) for this
  //   // This step connects the frontend to the backend
  //   const fetchChats = async () => {
  //       const dataReceived = await axios.get("/api/chats") //we use axios to perform http requests inside react
  //       console.log(dataReceived.data) ;
  //       console.log("Inside fetch chats ") ;
  //       setChats(dataReceived.data) ;
  //   }
  //   // UseEffect is used such that the function inside useEffect is called when this component
  //   // is rendered for the first time . so as soon as chats page loads up , we fetch the data
  //   useEffect(() => {
  //     fetchChats();
  //   }, [])
  // return (
  //   <div>
  //       Chat Page
  //       {chats.map((eachChat) => {
  //           // In react while working with lists , each list item should have unique key
  //           return <div key={eachChat._id}>{eachChat.chatName}</div>
  //       })}
  //   </div>
  // )\
  
  
  const { user } = ChatState();
  return (
    
    <div style={{ width: "100%" , backgroundColor:"#000000" }}>
      
      {user && <SideDrawer />}
      <Box
        display="flex"
        // justifyContent={"space-between"}
        gap={"0"}
        // padding={"10px"}
        width={"100%"}
        height={"90vh"}
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chats;

import { Box, Button, Stack, useToast, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/ChatLogics";
import GroupChatModal from "../Miscellaneous/GroupChatModal";

// function to dispaly all chats logged user is part of
const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();

  const { fetchAgain, selectedChat, setSelectedChat, user, chats, setChats } =
    ChatState();
  const [refreshChat, setRefreshChat] = useState(true)
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // making get request to fetch all chats the current logged user is part of
      const { data } = await axios.get("/api/chats", config);

      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // we store the logged user info every time page loads
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // setRefreshChat(!fetchAgain) ;
  }, [fetchAgain]);


  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }} // upon selecting a chat , the mychats section will be closed
      // and the chatbox will be opened
      flexDir="column"
      alignItems="center"
      padding={3}
      background="#202329"
      width={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      // borderWidth="1px"
      color={"white"}
    >
      {/* Header for the mychats section  */}
      <Box
        paddingBottom={3}
        paddingX={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      {/* Displaying list of individual chats in mychats section  */}
      <Box
        display="flex"
        flexDir="column"
        padding={3}
        background="#202329"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                onClick={() => setSelectedChat(chat)} // upon clicking a chat among the list that chat becomes selectedchat
                cursor="pointer"
                // when a chat is selected its style changes a little
                background={selectedChat === chat ? "#2E333D" : "#202329"}
                color={"white"}
                paddingX={3}
                paddingY={2}
                borderRadius="lg"
              >
                <Text>
                  {/* if this is a 1v1 chat , then find the sender and display its name , otherwise if it is a groupchat display the chatName 
                  refer the chatModel for more info  */}
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize={"xs"}>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 30
                      ? chat.latestMessage.content.substring(0, 31) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

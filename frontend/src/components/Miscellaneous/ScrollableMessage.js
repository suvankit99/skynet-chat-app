import { Avatar, Box } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isFirstMessage, showAvatar } from "../../config/ChatLogics";
import { ChatState } from "../../context/chatProvider";

const ScrollableMessage = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages.map((msg, index) => {
        return (
          <Box
            display={"flex"}
            flexDir={"column"}
            key={msg._id}
            alignItems={msg.sender._id === user._id ? "flex-end" : "flex-start"}
          >
            {showAvatar(messages, msg, index, user._id) && (
              <Avatar
                size="xs"
                name={msg.sender.name}
                src={msg.sender.pic}
              ></Avatar>
            )}
            {
              <Box
                display={"flex"}
                flexWrap={"wrap"}
                borderRadius={5}
                padding={2}
                marginTop={isFirstMessage(messages, msg, index) && "2"}
                marginBottom={1}
                background={msg.sender._id === user._id ? "#6B8AFD" : "#2E333D"}
                maxWidth={"50%"}
              >
                <div
                  style={{
                    wordWrap: "break-word" /* All browsers since IE 5.5+ */,
                    overflowWrap:
                      "break-word" /* Renamed property in CSS3 draft spec */,
                    width: "100%",
                    color:"white"
                  }}
                  
                >
                  {msg.content}
                </div>
              </Box>
            }
          </Box>
        );
      })}
    </ScrollableFeed>
  );
};

export default ScrollableMessage;

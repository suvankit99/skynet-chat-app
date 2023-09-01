import React, { createContext, useContext, useEffect, useState } from "react";

// Context api is basically used for declaring global variables / states

const ChatContext = createContext();

// By wrapping this chat provider around in the index.js file the states defined in the "value" field
// are accessible to the entire code base

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState({});
  const [chats, setChats] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // you can't use useHistory in the same component where you provide the context , you can use it
  // in a subcomponent so I used useHistory() in App component

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchAgain,
        setFetchAgain,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

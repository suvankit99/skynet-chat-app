import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { ChatState } from "../../context/chatProvider";


const Chatbox = () => {
  const { selectedChat } = ChatState();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      padding={3}
      background="#202329"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      // borderWidth="1px"
    >
      <SingleChat />
    </Box>
  );
};

export default Chatbox;
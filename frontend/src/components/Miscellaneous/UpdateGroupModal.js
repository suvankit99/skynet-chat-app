import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/chatProvider";
import UserBadgeItem from "./UserBadgeItem";
import axios from "axios";
import UserListItem from "./UserListItem";

const UpdateGroupModal = ({getAllMessages}) => {
  const { user, selectedChat, setSelectedChat, fetchAgain, setFetchAgain } =
    ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  // Rename the group
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chats/rename",
        {
          chatId: selectedChat._id,
          name: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setRenameLoading(false);
      setFetchAgain(!fetchAgain);
      console.log(selectedChat);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Could not rename group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setGroupChatName("");
    }
  };
  // Remove logged user from group
  const handleRemove = async (userTobeRemoved) => {
    console.log("Handle remove called")
    // Only admins can remove
    // We use the logic of removing the logged user only when leave group button is pressed
    // So if logged user is a group admin and is removing some other member only then it is allowed
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userTobeRemoved._id !== user._id
    ) {
      toast({
        title: "Error Occured!",
        description: "Only admins can remove members from group",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chats/groupremove",
        {
          chatId: selectedChat._id,
          userId: userTobeRemoved._id,
        },
        config
      );

      // if logged user has removed himself , it should not be able to that chat anymore , so make selecteed chat empty
      if (userTobeRemoved._id === user._id) {
        setSelectedChat();
      } else {
        setSelectedChat(data);
      }
      setLoading(false);
      setFetchAgain(!fetchAgain);
      // After a member is removed update all the messages of the chat 
      getAllMessages() ;
    } catch (error) {
      setLoading(false) ;
      toast({
        title: "Error Occured!",
        description: "Could not remove member from group",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // displaying search results for users to be added to group
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // Making the http request to the search user api endpoint
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      // toast({
      //   title: "Error Occured!",
      //   description: "Failed to fetch search results",
      //   status: "error",
      //   duration: 3000,
      //   isClosable: true,
      //   position: "bottom",
      // });
    }
  };

  // adding new user to group
  const handleAddUser = async (userToBeAdded) => {
    // If this user is already in the group
    if (
      selectedChat.users.find((u) => {
        return u._id === userToBeAdded._id;
      })
    ) {
      toast({
        title: "User already in the group",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // Only admins can add or remove members so if a non-admin tries to do it , give a warning
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admins can add members in a group",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = axios.put(
        "/api/chats/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToBeAdded._id,
        },
        config
      );

      console.log(data);
      setSelectedChat(data);
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Add new user to group ",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#202329">
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            fontSize={"30px"}
            fontFamily={"Work Sans"}
            color="white"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display={"flex"} width={"100%"} flexWrap={"wrap"}>
              {selectedChat.users.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      handleRemove(user);
                    }}
                  />
                );
              })}
            </Box>

            {/* Renaming group  */}
            <FormControl display={"flex"}>
              <Input
                value={groupChatName}
                placeholder="Group Chat Name"
                onChange={(e) => setGroupChatName(e.target.value)}
                marginBottom={3}
                marginTop={3}
                color="white"
              ></Input>
              <Button
                colorScheme="green"
                marginLeft={3}
                marginTop={3}
                onClick={handleRename}
              >
                {" "}
                Update{" "}
              </Button>
            </FormControl>
            {/* Adding new users to group  */}
            <FormControl>
              <Input
                value={search}
                placeholder="Add User"
                onChange={(event) => {
                  handleSearch(event.target.value);
                }}
                marginBottom={3}
                marginTop={3}
                color="white"
              ></Input>
            </FormControl>
            {/* Displaying search results  for users to be added to group  */}
            {loading ? (
              <Spinner size={"md"} />
            ) : searchResult ? (
              searchResult.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      handleAddUser(user);
                    }}
                  />
                );
              })
            ) : (
              <p>No such user found</p>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => {handleRemove(user)}}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;

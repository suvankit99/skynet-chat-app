import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  Input,
  useToast,
  Box,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../context/chatProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

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
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch search results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleDelete = (userToBeDeleted) => {
    setSelectedUsers(
      selectedUsers.filter((user) => {
        return user._id !== userToBeDeleted._id;
      })
    );
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
    
      //   making a post request to send data to backend needed to create this group chat 
      const { data } = await axios.post(
        `/api/chats/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]); // we put data first so that the newly created chat is displayed on top 
      onClose(); // close the modal 
      // success modal
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      {/* Here the new group chat button will be displayed  */}
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent background={"#202329"}>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
            color={"white"}
          >
            Create Group Chat
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody display="flex" flexDir="column" alignItems="center">
            {/* Taking input for name of group chat  */}
            <FormControl>
              <Input
                placeholder="Chat Name"
                marginBottom={4}
                onChange={(e) => setGroupChatName(e.target.value)}
                color={"white"}
              />
            </FormControl>
            {/* Taking input for users to be added to group chat  */}
            <FormControl>
              <Input
                placeholder="Add Users"
                marginBottom={2}
                onChange={(e) => handleSearch(e.target.value)}
                color={"white"}
              />
            </FormControl>
            {/* Displaying users that were selected for the group chat  */}
            <Box d="flex" w="100%" flexWrap={"wrap"}>
              {selectedUsers.map((user) => {
                return (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      handleDelete(user);
                    }}
                  />
                );
              })}
            </Box>

            {/* Displaying list of search results for users to be added to the group  */}
            {loading ? (
              <Spinner margin="auto" display="flex" justifyContent={"center"} />
            ) : searchResult ? (
              searchResult.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      handleGroup(user);
                    }}
                  />
                );
              })
            ) : (
              <p>No such user found</p>
            )}
          </ModalBody>

          <ModalFooter>

            <Button colorScheme="facebook" onClick = {handleSubmit}>Create group</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;

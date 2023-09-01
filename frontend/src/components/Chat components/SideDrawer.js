import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  DrawerHeader,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Input,
  useToast,
  background,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "../Miscellaneous/ProfileModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../Miscellaneous/UserListItem";
import { Spinner } from "@chakra-ui/spinner";
import NotificationBadge from "../Miscellaneous/NotificationBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const SideDrawer = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const {
    user,
    setSelectedChat,
    selectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  // Function to open a chat that we click upon getting search results
  const accessChat = async (userId) => {
    // by clicking on a search result it will create a new 1v1 chat
    try {
      console.log("Inside access Chat");
      setChatLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      // format for axios post req => (url , form-data , request configuration)
      const { data } = await axios.post("/api/chats", { userId }, config);
      console.log("data = ", data);

      if (
        !chats.find((c) => {
          return c._id === data._id;
        })
      ) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setChatLoading(false);
      onClose(); // close the side drawer
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch this user's chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  // handle click on search go button
  const handleSearch = async () => {
    // if nothing fed in the search bar then dispaly a warning toast
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 900,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    // otherwise if some search input is given
    try {
      // search begins so loading is true
      setLoading(true);

      // configuration / headers for the http request
      // we have to sent the user's JWT token for authorizatiomn
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // make the request and fetch the data
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setSearchResult(data);

      // after data is fetched store it , and loading is stopped
      setLoading(false);
    } catch (error) {
      // catch all other errors
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // To log out just redirect to home page
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  // Displaying users search results
  const displayUsers = (userObj) => {
    return (
      <UserListItem
        key={userObj._id}
        user={userObj}
        handleFunction={() => {
          accessChat(userObj._id);
        }}
      />
    );
  };

  return (
    <Box background={"#393E46"}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        background="#202329"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        margin={0}
        borderRadius={5}
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Box
            as={Button}
            background={"#white"}
            onClick={onOpen}
            variant={"solid"}
            _hover={{ background: "#EEEEEE" }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              // style={{ color: "#ffffff" }}
            ></FontAwesomeIcon>
            <Text
              display={{ base: "None", md: "flex" }}
              paddingX={"10px"}
              // color={"white"}
            >
              Search User
            </Text>
          </Box>
        </Tooltip>

        <Box display={"flex"} gap={"10px"}>
        <Text
          color={"white"}
          fontSize={"3xl"}
          fontWeight={"bold"}
          fontFamily={"Work Sans"}
        
        >
          SkyNet
        </Text>
        <FontAwesomeIcon icon={faComment} size="lg" style={{color: "#ffffff"}} />
        </Box>
        <Box display={"flex"} flexDir={"row"} justifyContent={"flex-end"}>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge count={notifications.length} />
              {/* <BellIcon fontSize={"2x1"} m={1} /> */}
            </MenuButton>
            <MenuList>
              {notifications.length === 0 && (
                <Text display={"flex"} justifyContent={"center"}>
                  No new messages
                </Text>
              )}
              {notifications.map((notif) => {
                return (
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      setNotifications(
                        notifications.filter((n) => {
                          return n._id !== notif._id;
                        })
                      );
                    }}
                  >
                    {notif.chat.isGroupChat
                      ? `New message in ${notif.chat.chatName}`
                      : `New message from ${notif.sender.name}`}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>

          <Menu>
            <div>
              <MenuButton
                backgroundColor={"#white"}
                color={"white"}
                as={Button}
                rightIcon={<ChevronDownIcon color={"black"}/>}
                marginLeft={"3"}
              >
                <Avatar
                  size={"sm"}
                  cursor={"pointer"}
                  name={user.name}
                  src={user.pic}
                />
              </MenuButton>
            </div>
            <MenuList>
              {/* <MenuItem>My profile</MenuItem>
               */}
              <ProfileModal user={user} />
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Box display={"flex"}>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent background={"#222831"}>
            <DrawerHeader borderBottomWidth="1px" color={"white"}>
              Search Users
            </DrawerHeader>
            <DrawerBody>
              {/* // Search Box  */}
              <Box display="flex" pb={2}>
                <Input
                  placeholder="Search by name or email"
                  marginRight={2}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  background={"#2E333D"}
                  color={"white"}
                />
                <Button
                  variant={"solid"}
                  color={"black"}
                  backgroundColor={"#white"}
                  onClick={handleSearch}
                  _hover={{ backgroundColor: "#F4EEFF" }}
                >
                  Go
                </Button>
              </Box>
              {/* // Displaying search results  */}
              {loading ? <ChatLoading /> : searchResult?.map(displayUsers)}

              {chatLoading && <Spinner marginLeft="auto" display="flex" />}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Box>
    </Box>
  );
};
export default SideDrawer;

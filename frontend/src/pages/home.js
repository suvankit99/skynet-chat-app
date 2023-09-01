import React, { useEffect } from "react";
import {
  Box,
  Container,
  HStack,
  Image,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import AppHeader from "../components/Miscellaneous/AppHeader";

const Home = () => {
  const history = useHistory();

  // If user is already logged in then redirect him to chats page
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userinfo"));
    if (userInfo) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Box width={"100%"} display={"flex"} flexDir={"column"}>
      <AppHeader/>
      <Stack width={"100%"} direction={"row"} spacing={"0"}>
        <Box
          bg="white"
          w="50%"
          m="30px 0 40px 120px"
          borderRadius="lg"
          borderRightRadius={"0"}
          backgroundColor={"#393E46"}
        >
          <Image
            src={require("../images/home-image-3.png")}
            alt="Home-image"
            objectFit={"cover"}
            width={"100%"}
            height={"73vh"}
          />
        </Box>

        <Box
          d="flex"
          flexDir="row"
          justifyContent="center"
          p={3}
          bg="#393E46"
          w="50%"
          m="30px 120px 40px 0"
          borderRadius="lg"
          borderLeftRadius={"0"}
        >
          <Tabs variant="soft-rounded" paddingTop={"20px"}>
            <TabList>
              <Tab width="50%" color={"white"}>Login</Tab>
              <Tab width="50%" color={"white"}>SignUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login></Login>
              </TabPanel>
              <TabPanel>
                <SignUp></SignUp>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </Box>
  );
};

export default Home;

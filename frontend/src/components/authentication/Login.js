import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  Button,
  Toast,
  useToast,
  Box,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ChatState } from "../../context/chatProvider";

const Login = () => {
  const [show, setshow] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setloading] = useState(false);
  // const [mouseOver, setMouseOver] = useState(false)
  const toast = useToast();
  const history = useHistory();
  const { fetchAgain , setFetchAgain , user , setUser} = ChatState()
  const handleForgotPassword = () => {
    history.push("/reset-password");
  };
  const handleClick = () => {
    setshow(!show);
  };
  const submitHandler = async () => {
    setloading(true);
    if (!email || !password) {
      toast({
        title: "Please fill all the details",
        status: "warning",
        duration: 4500,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }

    try {
      // defining headers for the http post request
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // We make the post request
      const { data } = await axios.post(
        "/api/users/login",
        {
          email,
          password,
        },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      // We also retrieve the data to be sent in post req
      setUser(data)
      toast({
        title: "Login Successful",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      
    }
  };
  return (
    <>
    <VStack spacing="-0.5" display={"flex"}>
      <FormControl>
        <FormLabel color={"white"} marginTop={"5vh"}>Email</FormLabel>
        <Input
          type="email"
          value={email}
          placeholder="Enter email"
          isRequired="true"
          onChange={(e) => setEmail(e.target.value)}
          color={"white"}
          
        />

        <FormLabel color={"white"} marginTop={"2vh"}>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            color={"white"}
            
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <HStack spacing={"5"} marginTop={"5vh"}>
      <Button
        colorScheme="blue"
        width={"100%"}
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>

      <Button
        colorScheme="red"
        width={"100%"}
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@gmail.com");
          setPassword("12345");
        }}
      >
        Guest user
      </Button>

      <Button
        colorScheme="teal"
        width={"200%"}
        style={{ marginTop: 15 }}
        onClick={handleForgotPassword}
      >
        Forgot Password
      </Button>
      </HStack>
    </VStack>
    </>
  );
};

export default Login;

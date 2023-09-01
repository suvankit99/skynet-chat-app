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
  Container,
  Box,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import AppHeader from "../components/Miscellaneous/AppHeader";

const NewPassword = () => {
  const [show, setshow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();

  const handleSubmmit = async () => {
    setLoading(true);
    // check if both password and confirm password fields are filled
    if (!password || !confirmPassword) {
      toast({
        title: "Please fill all the details",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    // check if both password and confirm password values are equal
    if (password !== confirmPassword) {
      toast({
        title: "Password and confirm password don't match",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    // make axios request
    try {
      const userData = JSON.parse(localStorage.getItem("user-password-change"));
      const { data } = await axios.put(
        "/api/users/new-password",
        {
          id: userData.id,
          token: userData.token,
          newPassword: password ,
        }
      );
      toast({
        title: "Password updated successfully",
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      
    } catch (error) {
      toast({
        title: "Could not update password",
        status: "error",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const handleClick = () => {
    setshow(!show);
  };
  return (
    <Container maxW="xl" centerContent>
      <AppHeader/>
      <Box
        d="flex"
        flexDir="row"
        justifyContent="center"
        p={3}
        bg="#393E46"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
      
      >
        <VStack spacing="-0.5">
          <FormControl>
            <FormLabel color={"white"} marginTop={"1vh"}>New Password</FormLabel>
            <InputGroup size="md">
              <Input
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

            <FormLabel  color={"white"} marginTop={"1vh"}>Confirm password</FormLabel>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type={show ? "text" : "password"}
                placeholder="Enter password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
                color={"white"}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            colorScheme="blue"
            width="20%"
            style={{ marginTop: 15 }}
            onClick={handleSubmmit}
            isLoading={loading}
          >
            Submit
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default NewPassword;

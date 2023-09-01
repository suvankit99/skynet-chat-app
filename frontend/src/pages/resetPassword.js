import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Toast,
  useToast,
  Box,
  Container,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import AppHeader from "../components/Miscellaneous/AppHeader";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const handleSendLink = async () => {
    setLoading(true);
    if (!email) {
      toast({
        title: "Please fill a valid email",
        status: "warning",
        duration: 4500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/users/reset-password",
        {
          email: email,
        }
        ,
        config
      );

      toast({
        title: "Link sent to email successfully",
        status: "success",
        duration: 4500,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("user-password-change" , JSON.stringify(data)) ;
      setLoading(false);
      
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Could not send password reset link to email",
        status: "error",
        duration: 4500,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
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
            <FormLabel color={"white"}>Enter email to get a password reset link</FormLabel>
            <Input
              type="email"
              value={email}
              placeholder=""
              isRequired="true"
              onChange={(e) => {
                setEmail(e.target.value) ;
              }}
              color={"white"}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            width="20%"
            style={{ marginTop: 15 }}
            onClick={handleSendLink}
            isLoading={loading}
          >
            Send link
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default ResetPassword;

import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputRightElement,
  Button,
  Divider,
  Text,
  HStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
// import { OAuthButtonGroup } from "./OAuth";
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const SignUp = () => {
  const [show, setshow] = useState(false);
  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [pic, setpic] = useState("");
  const [loading, setloading] = useState(false);
  const history = useHistory();
  // using toast component for notifying user for selecting picture
  const toast = useToast();

  // handling uploading picture
  const postDetails = (pics) => {
    // When image upload starts , set loading to true
    setloading(true);
    // if we get an undefined image , display a warning toast
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 4500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // if the file uploaded is an image i.e. it is of jpeg or png format
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      // then we send this image data to cloudinary via the image upload url in the fetch function
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "suvankit-chat-app");
      // here we make a post request and send the image data
      fetch("https://api.cloudinary.com/v1_1/suvankit-chat-app/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          // we set pic to the url of the image on cloudinary
          setpic(data.url.toString());
          console.log(data.url.toString());
          // and when image has been uploaded set loading to false
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    } else {
      // In all other cases create an warning toast , and set loading to false as well
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 4500,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }
  };

  // Handling what should happen when sign up details are submitted on clicking signup button
  const submitHandler = async () => {
    setloading(true);
    // If any of the fields are undefined we display a warning toast
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
      return;
    }
    // If password is not matching then also we display a warning toast
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 4500,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    // if we reach here it means all the provided details are valid
    console.log(name, email, password, pic);
    // Since we have the all the valid details of the user , we make a http post request using axios
    // and send all the user data as a json object
    try {
      // defining headers for the http post request
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // We make the post request
      const { data } = await axios.post(
        "/api/users",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      // We also retrieve the data to be sent in post req
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      // We store the user data sent in post request in our browser's localstorage
      localStorage.setItem("userInfo", JSON.stringify(data));
      setloading(false);
      // We use the history hook in react for redirecting to other pages
      // basically history.push("./chats") is same as res.redirect("./chats")
      // we are basically rediecting the user to the "/chats" page .
      history.push("/chats");

      // finally we catch any remaining errors
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 4500,
        isClosable: true,
        position: "bottom",
      });
      setloading(false);
    }
  };

  const handleClick = () => {
    setshow(!show);
  };
  return (
    <VStack spacing="2">
      <FormControl>
        <FormLabel color={"white"}>Username</FormLabel>
        <Input
          size={"sm"}
          placeholder="Enter username"
          isRequired="true"
          onChange={(e) => {
            setname(e.target.value);
          }}
          color={"white"}
          borderRadius={"5"}
        />

        <FormLabel color={"white"}>Email</FormLabel>
        <Input
          size={"sm"}
          type="email"
          placeholder="Enter email"
          isRequired="true"
          onChange={(e) => setEmail(e.target.value)}
          color={"white"}
          borderRadius={"5"}
        />

        <FormLabel color={"white"}>Password</FormLabel>
        <InputGroup size="md">
          <Input
            size={"sm"}
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            color={"white"}
            borderRadius={"5"}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick} marginBottom={"1vh"}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>

        <FormLabel color={"white"}>Confirm password</FormLabel>
        <InputGroup size="md">
          <Input
            size={"sm"}
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            color={"white"}
            borderRadius={"5"}
          />
          <InputRightElement width="4.5rem" >
            <Button h="1.75rem" size="sm" onClick={handleClick} marginBottom={"1vh"}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel color={"white"}>Upload profile picture</FormLabel>
        <Input
          size={"sm"}
          type="file"
          // p={1.5}
          paddingTop={"0.5vh"}
          paddingLeft={"1vh"}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
          color={"white"}
          borderRadius={"5"}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        color={"white"}
        width="20%"
        style={{ marginTop: 15 }}
        isLoading={loading}
        onClick={submitHandler}
      >
        SignUp
      </Button>
    </VStack>
  );
};

export default SignUp;

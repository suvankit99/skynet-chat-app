import { Box, Text } from "@chakra-ui/react";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const AppHeader = () => {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      gap={"10px"}
      paddingTop={"20px"}
      paddingBottom={"0"}
    >
      <Text
        color={"white"}
        fontSize={"7xl"}
        fontWeight={"bold"}
        fontFamily={"Work Sans"}
      >
        SkyNet
      </Text>
      <FontAwesomeIcon
        icon={faComment}
        size="3x"
        style={{ color: "#ffffff" }}
      />
    </Box>
  );
};

export default AppHeader;

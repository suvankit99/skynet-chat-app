import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Badge
    fontWeight={"medium"}
      paddingX={2}
      paddingY={2}
      borderRadius="lg"
      margin={1}
      marginBottom={2}
      variant="solid"
      fontSize={12}
      background="#FC5185"
      color={"white"}
      cursor="pointer"
      
    >
        {user.name}
        <CloseIcon onClick={handleFunction} paddingLeft={1}/>

    </Badge>
  );
};

export default UserBadgeItem;

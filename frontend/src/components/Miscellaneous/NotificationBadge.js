import React from "react";
// import { Badge } from '@mui/material';
import NotificationsIcon from "@mui/icons-material/Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { Badge, Box } from "@chakra-ui/react";

const NotificationBadge = ({ count }) => {
  return (
    <Box display={"flex"} flexDir={"row"}>
      <Box marginTop={"2"}><FontAwesomeIcon icon={faBell} size="lg" style={{ color: "#ffffff" }} /></Box>
      <Badge fontSize={"xs"} colorScheme="blue" variant={"solid"} height={"18px"}>
        {count}
      </Badge>
      
    </Box>
  );
};

export default NotificationBadge;

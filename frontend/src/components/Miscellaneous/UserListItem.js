import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      width="100%"
      display="flex"
      cursor="pointer"
      background="#393E46"
      color="white"
      _hover={{
        background: "#00ADB5",
        color: "white",
      }}
      
      alignItems="center"
      paddingX={3}
      paddingY={2}
      marginBottom={2}
      borderRadius="lg"
    >
      <Avatar
        marginRight={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

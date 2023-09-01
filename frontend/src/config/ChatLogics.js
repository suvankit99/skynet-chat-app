const getSender = (loggedUser, users) => {
  if (users[0]._id === loggedUser._id) {
    return users[1].name;
  } else {
    return users[0].name;
  }
};

const getSenderObject = (loggedUser, users) => {
  if (users[0]._id === loggedUser._id) {
    return users[1];
  } else {
    return users[0];
  }
};

const showAvatar = (msgArr , currMsg , i , userId) => {
  // if it is the logged user dont show
  if(currMsg.sender._id === userId) return false ;
  // if it is the other user and it is the first message show it 
  if(i === 0) return true ;
  // if it is the other user and previous message was from some other user then show it  
  if(currMsg.sender._id !== msgArr[i - 1].sender._id ) return true ;
}

const isFirstMessage = (msgArr , currMsg , i) => {
  // if it is very first message
  if(i === 0) return true ;
  // if the previos message is of different user 
  if(currMsg.sender._id !== msgArr[i - 1].sender._id) return true ;
  return false ;
}
export { getSender, getSenderObject  , showAvatar , isFirstMessage };

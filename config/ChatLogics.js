//jab sender ka message last hota hai toh ye true return karta hai taake woh reciever ke msg pe icon show kr sake
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1]?.sender._id !== m.sender._id ||
      messages[i + 1]?.sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

//jab reciver ka message last hota hai toh ye true return karta hai taake woh reciever ke msg pe icon show kr sake
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1]?.sender._id !== userId
  );
};

export const marginBottom = (messages, i) => {
  return i === messages.length - 1;
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1]?.sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 45;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1]?.sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 5;
  else return "auto";
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1]?.sender._id === m.sender?._id;
};

export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser ? users[1]?.name : users[0]?.name;
};

export const whoIsSender = ( loggedUser, users) =>{
  return users._id === loggedUser ? 'You' : users.name;

}

export const getImage = (loggedUser, users) => {
  return users[0]._id === loggedUser ? users[1]?.image : users[0]?.image;
};

export const getId = (loggedUser, users) => {
  return users[0]._id === loggedUser ? users[1]?._id : users[0]?._id;
};

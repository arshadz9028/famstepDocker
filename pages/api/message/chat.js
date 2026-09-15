import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import Chat from "../../../model/chatModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();

    const session = await getSession({ req });
    const currentUser = session?.user?.id;
    const { newSelected } = req.body;

    if (!newSelected) {
      return res.status(400).send("Bad Request: UserId param not sent with request");
    }

    let existingChat = await Chat.findOne({
      $and: [
        { users: { $elemMatch: { $eq: currentUser } } },
        { users: { $elemMatch: { $eq: newSelected } } },
      ],
    }) .populate("users", "-password")

    if (existingChat) {
      const senderUserIndex = existingChat.chatLength.findIndex(
        (entry) => entry.senderUser == currentUser
      );
      if (senderUserIndex === -1) {
        existingChat.chatLength.push({
          recieverUser: newSelected,
          senderUser: currentUser,
          chatId: existingChat._id,
          counterMessage: 0,
          isSeen: true,
          isClear: true,
        });

        await existingChat.save();
      }

      return res.status(200).json(existingChat);
    }

    const chatData = {
      chatName: currentUser,
      isGroupChat: false,
      users: [currentUser, newSelected],
      chatLength: [
        {
          recieverUser: newSelected,
          senderUser: currentUser,
          counterMessage: 0,
          isSeen: true,
          isClear: true,
        },
      ],
    };

    const createdChat = await Chat.create(chatData);

    chatData.chatLength[0].chatId = createdChat._id;
    await createdChat.updateOne(chatData);

    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("latestMessage.sender");

    return res.status(200).json(fullChat);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
}

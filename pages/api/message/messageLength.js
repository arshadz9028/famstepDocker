import connectDb from "../../../database/conn";
import Chat from "../../../model/chatModel";
import { getSession } from "next-auth/react";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    const userId = session?.user?.id;

    if (!session) {
      return res.status(400).json({ success: false, message: "Access denied" });
    }

    if (req.method === "POST") {
      const { selectedId, otherUserId } = req.body;

      let matchedChat = await Chat.findOne({ _id: selectedId });
      if (!matchedChat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      
      const userIndex = matchedChat.chatLength.findIndex(
        (entry) => entry.recieverUser == userId
      );

      if (userIndex === -1) {
        const newChatLengthItem = {
          recieverUser: userId,
          senderUser: otherUserId,
          chatId: matchedChat._id,
          counterMessage: 1,
          isSeen: false,
          isClear: false
        };
        matchedChat.chatLength.push(newChatLengthItem);

      } else {

        const chatLengthItem = matchedChat.chatLength[userIndex];
        chatLengthItem.counterMessage += 1;
        chatLengthItem.isSeen = false;

      }

      await matchedChat.save();

      let userMsgData = await Chat.findById(matchedChat._id)

        .populate("users")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

      await Chat.populate(userMsgData, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      const secret = process.env.ENCRYPTION_KEY;
      const decryptedText = CryptoJS.AES.decrypt(
        userMsgData.latestMessage.content,
        secret
      ).toString(CryptoJS.enc.Utf8);
      userMsgData.latestMessage.content = decryptedText;

      return res.status(200).json({ success: true, message: userMsgData });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

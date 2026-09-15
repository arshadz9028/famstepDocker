import connectDb from "../../../database/conn";
import Chat from "../../../model/chatModel";
import { getSession } from "next-auth/react";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });

    if (!session) {
      return res.status(400).json({ success: false, message: "Access denied" });
    }

    if (req.method === "PUT") {
      const { message } = req.query;
      try {
        // Find the chat document based on userId and selectedId
        const matchedChat = await Chat.findOne({_id: message})

        if (matchedChat) {
          matchedChat.chatLength.forEach((val) => {
            if (val.recieverUser == session.user.id) {
              val.isSeen = true;
              val.counterMessage = 0; 
            }
          });
    
          await matchedChat.save();

          const userMsgData = await Chat.findById(message)
          .populate("users")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({ updatedAt: -1 });
        // Populate the 'latestMessage.sender' path with specific fields
        await Chat.populate(userMsgData, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        const secret = process.env.ENCRYPTION_KEY
        const decryptedText = CryptoJS.AES.decrypt(userMsgData.latestMessage.content, secret).toString(CryptoJS.enc.Utf8);
        userMsgData.latestMessage.content = decryptedText;
    
          return res
            .status(200)
            .json({ message: userMsgData });
        } else {
          return res.status(404).json({ success: false, message: "Chat not found" });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }
    }
    
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

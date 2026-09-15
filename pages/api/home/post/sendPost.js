import connectDb from "../../../../database/conn";
import Chat from "../../../../model/chatModel";
import User from "../../../../model/userModel";
import Message from "../../../../model/messageModel";
import { getSession } from "next-auth/react";
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  try {
    connectDb().catch((error) => res.json({ error: "connection failed...!" }));
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = session.user.id;
    const userName = session.user.username;
    if (req.method === "PUT") {
      const { imageSend, finalUser,content,imageId } = req.body;
      for (const sendUser of finalUser) {
        let matchedChat = await Chat.findOne({
          $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: sendUser } } },
          ],
        });
        if(!matchedChat){
            const chatData = {
                chatName: userId,
                isGroupChat: false,
                users: [userId, sendUser],
            };

             matchedChat = await Chat.create(chatData);

        }
        const chatLengthItemIndex = matchedChat.chatLength.findIndex(
          (item) => item.recieverUser == sendUser
        );
        const chatLengthSender = matchedChat.chatLength.findIndex(
          (item) => item.senderUser == sendUser
        );
        if (chatLengthSender !== -1) {
          // Update the chat length item for the sender user
          const chatLengthItem = matchedChat.chatLength[chatLengthSender];
          chatLengthItem.isClear = false;
        }
       
        if (chatLengthItemIndex === -1) {
          const newChatLengthItem = {
            recieverUser: sendUser,
            counterMessage: 1,
            senderUser: session?.user.id,
            isSeen: false,
            chatId: matchedChat._id,
            // isClear:false
          };
          matchedChat.chatLength.push(newChatLengthItem);

        }
        else {
          const chatLengthItemToUpdate =
            matchedChat.chatLength[chatLengthItemIndex];
          if (chatLengthItemToUpdate.isSeen === true) {
            chatLengthItemToUpdate.counterMessage = 0;
          }
          await chatLengthItemToUpdate.save();
          chatLengthItemToUpdate.counterMessage += 1;
          chatLengthItemToUpdate.isSeen = false;


        }
        await matchedChat.save();

        const secret = process.env.ENCRYPTION_KEY;
        const encryptedText = CryptoJS.AES.encrypt(content, secret).toString();
  
        const chatId = matchedChat._id 
        let newMessage = {
          sender: userId,
          UserR:{recieverUser:sendUser,isCleared:false},
          UserS:{currentUser:userId,isCleared:false},
          attachUrl: imageSend,
          content: encryptedText || '',
          chat: chatId,
          postId:imageId
        };
        let message = await Message.create(newMessage);

        message = await message.populate("sender", "name username image");
        message = await message.populate("chat");
        message = await User.populate(message, {
          path: "chat.users",
          select: "name username image",
        });
        message.content = content;
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
        res.json(message);
        const userMsgData = await Chat.find({ users: { $elemMatch: { $eq: session?.user?.id } } })
        .populate("users")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
      // Populate the 'latestMessage.sender' path with specific fields
      await Chat.populate(userMsgData, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
        const io = req.socket.server.io;
        if (io) {
          io.emit("counter", { data: userMsgData });
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

import connectDb from "../../../database/conn";
import Chat from '../../../model/chatModel';
import { getSession } from "next-auth/react";
import Message from '../../../model/messageModel';

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      await connectDb();

      const { message } = req.query;
      const session = await getSession({ req });
      const userId = session?.user?.id;

      const matchedChat = await Chat.findOne({ _id: message });
      if (!matchedChat) {
        return res.status(404).json({ message: 'Chat not found' });
      }

      const messageChatArray = await Message.find({ chat: message });

      for (const message of messageChatArray) {
        const isCurrentUserSender = message.UserS.currentUser == userId;
        const isCurrentUserReceiver = message.UserR.recieverUser == userId;

        if (isCurrentUserSender) {
          await Message.updateOne(
            { _id: message._id },
            { $set: { 'UserS.isCleared': true } }
          );
        } else if (isCurrentUserReceiver) {
          await Message.updateOne(
            { _id: message._id },
            { $set: { 'UserR.isCleared': true } }
          );
        }
      }

      const userIndex = matchedChat.chatLength.findIndex(entry => entry.senderUser == userId);

      if (userIndex === -1 ) {

        const userIndex1 = matchedChat.chatLength.filter(entry => entry.recieverUser == userId);
        const newChatLengthItem = {
          recieverUser: userIndex1[0].senderUser.toString(),
          senderUser: userId,
          counterMessage: 0,
          chatId: message,
          isSeen: true,
          isClear: true
        };
        matchedChat.chatLength.push(newChatLengthItem);
      } else if ( !matchedChat.chatLength[userIndex].isClear && matchedChat.chatLength.length === 1) {
          matchedChat.chatLength[userIndex].isClear = true;

          const userIndex1 = matchedChat.chatLength.filter(entry => entry.senderUser == userId);

          const newChatLengthItem = {
            recieverUser: userId,
            senderUser:userIndex1[0].recieverUser.toString(),
            chatId: message,
            counterMessage: 0,
            isSeen: true,
            isClear: false
          };
          matchedChat.chatLength.push(newChatLengthItem);
      
      }else if ( !matchedChat.chatLength[userIndex].isClear && matchedChat.chatLength.length === 2){
        matchedChat.chatLength[userIndex].isClear = true;

      }

      await matchedChat.save();

      if (matchedChat.chatLength.every(entry => entry.isClear)) {

        await Message.deleteMany({ chat: message });
        await Chat.findByIdAndDelete(message);
      }

      return res.status(200).json({ message: 'Chat and messages cleared successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}

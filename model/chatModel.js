import { Schema, model, models } from "mongoose";
// Create a schema and model for the chat messages
const chatModel = new Schema(
  {
    chatName: { type: Schema.Types.ObjectId, ref: "User"  },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    chatLength: [
      {
        recieverUser: { type: Schema.Types.ObjectId, ref: "User" },
        senderUser: { type: Schema.Types.ObjectId, ref: "User" },
        chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
        counterMessage: { type: Number },
        isSeen: { type: Boolean },
        isClear: { type: Boolean , default: false },
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = models && models.Chat ? models.Chat : model("Chat", chatModel);

export default Chat;

import { Schema, model, models } from "mongoose";
const messageSchema = new Schema(
    {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    UserR: { 
      recieverUser:{type: String, ref: "User"} ,
      isCleared:{type: Boolean,default:false}
    },
    UserS: { 
      currentUser:{ type: String, ref: "User" },
      isCleared:{type: Boolean,default:false}
    },
    postId:{type: String,ref: "Post"},
    attachUrl:{type: String, trim: true, default: ''},
    content: { type: String, trim: true,  default: '' },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);


const Message = models && models.Message ? models.Message : model("Message", messageSchema);

export default Message
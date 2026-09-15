import { Schema, model, models } from "mongoose";
import mongoose from 'mongoose';

const userBlockSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId, ref: "User" 
    },
    blockedIds: [
      {
        userId: { type: Schema.Types.ObjectId, required: true,ref: "User"  },
       
      }
    ],
},
{
  timestamps: true, // Adds createdAt and updatedAt fields
}
);
const UserBlock =
  models && models.UserBlock
    ? models.UserBlock
    : model("UserBlock", userBlockSchema);

export default UserBlock;

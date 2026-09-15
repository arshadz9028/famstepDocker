import { Schema, model, models } from "mongoose";
import mongoose from 'mongoose';

const accountBlockSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId, ref: "User" 
    },
    blockedIds: [
      {
        userId: { type: String, required: true },
      }
    ],
},
{
  timestamps: true, // Adds createdAt and updatedAt fields
}
);
const AccountBlock =
  models && models.AccountBlock
    ? models.AccountBlock
    : model("AccountBlock", accountBlockSchema);

export default AccountBlock;

import { Schema, model, models } from "mongoose";
import mongoose from 'mongoose';

const cardDeleteSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId, ref: "User" 
    },
   
    deleteNetCard: [
      {
        groupId: { type: String, required: true },
      }
    ],
},
{
  timestamps: true, // Adds createdAt and updatedAt fields
}
);
const CardNetDelete =
  models && models.CardNetDelete
    ? models.CardNetDelete
    : model("CardNetDelete", cardDeleteSchema);

export default CardNetDelete;

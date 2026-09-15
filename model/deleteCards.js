import { Schema, model, models } from "mongoose";
import mongoose from 'mongoose';

const cardDeleteSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId, ref: "User" 
    },
    deletedCards: [
      {
        userId: { type: String, required: true },
      }
    ],
  
},
{
  timestamps: true, // Adds createdAt and updatedAt fields
}
);
const CardDelete =
  models && models.CardDelete
    ? models.CardDelete
    : model("CardDelete", cardDeleteSchema);

export default CardDelete;

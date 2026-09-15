import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
const searchHistorySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    histUser: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        currentDate:{
          type:Date
        }
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const SearchHistorys =
  models.SearchHistory || model("SearchHistory", searchHistorySchema);

export default SearchHistorys;

import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
const AchievementsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    contestId: { type: mongoose.Schema.Types.ObjectId, ref: "Competition" },

    level: { type: String, ref: "Competition" },
    score: { type: Number },
    rank: { type: Number },
    solution: { type: String },
    likes: {
      type: [{ userId: String}],
    },
  },
  {
    timestamps: true,
  }
);
const Achievement =
  models && models.Achievement
    ? models.Achievement
    : model("Achievement", AchievementsSchema);
export default Achievement;

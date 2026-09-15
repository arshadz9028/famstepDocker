import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
const PracticeSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
     
        code: { type: String },
       
    },
    {
        timestamps: true,
    }
);
const Practice =
    models && models.Practice
        ? models.Practice
        : model("Practice", PracticeSchema);
export default Practice;

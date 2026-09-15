import { Schema, model, models } from "mongoose";
// import defaultpic from "../public/default.png";

const FeedbackSchema = new Schema(
  {
    name: { type: String },
    feed:{type: String},
    device:{type: String},
    Improvement: { type: String },
    Features: { type: String },
    Thoughts: { type: String },
    additional: { type: String },
    phoneEmail: { type: String },
  },
  { timestamps: true }
);

const Feedback = models && models.Feedback ? models.Feedback : model("Feedback", FeedbackSchema);

export default Feedback;

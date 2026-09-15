import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
import { type } from "os";
const CompetitionSchema = new mongoose.Schema(
  {
    stage: {
      type: String,
    },
    ContestName: {
      type: String,
    },
    combinedStart: { type: Date },
    combinedEnd: { type: Date },
    prize: { type: String },
    usersAllowed: { type: String },
    language: { type: String },
    requiredInput: { type: Boolean },
    question: { type: String },
    answer: { type: String },
    rule: { type: String },
    about: { type: String },
    image: {
      type: String,
      required: true,
      sparse: true,
    },
    hiddenString: [{
      StringInput1:{type: String,default:""},
      StringInput2:{type: String,default:""},
      StringInput3:{type: String,default:""},
      StringOutput1:{type: String,default:""},
      StringOutput2:{type: String,default:""},
     StringOutput3:{type: String,default:""},
    }],
    isDataType:{type:String},
    // hiddenNumber: [{
    //   NumberInput1:{type: Number,default:0},
    //   NumberInput2:{type: Number,default:0},
    //   NumberInput3:{type: Number,default:0},
    //   NumberOutput1:{type: Number,default:0},
    //   NumberOutput2:{type: Number,default:0},
    //  NumberOutput3:{type: Number,default:0},
    // }],
    contestState: { type: String, default: "upcoming" },
    isTimeLeft: { type: Boolean },
    isTimeStart: { type: Boolean },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isNotified: { type: Boolean, default: true },
        isViewedModel:{ type: Boolean, default: false },
        isLastIndex:{ type: Boolean, default: false },
      },
    ],
    submission: [
      {
        userSub: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        executionTime: { type: String },
        RunCounter: { type: Number },
        lineCount: { type: Number },
        score: { type: Number },
        solution: { type: String },
      },
    ],
    rankers: [
      {
        userRank: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Competition =
  models && models.Competition
    ? models.Competition
    : model("Competition", CompetitionSchema);
export default Competition;

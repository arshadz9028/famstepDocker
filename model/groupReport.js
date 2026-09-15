import { Schema, model, models } from "mongoose";
import mongoose from 'mongoose';

const userReportSchema = new Schema(
  {
    ReportGroup: {
        type: Schema.Types.ObjectId, ref: "User" 
    },
   Report:[{
    victimUser:{type: Schema.Types.ObjectId, ref: "User" },
    reason:{type:String}
   }]
},
{
  timestamps: true, // Adds createdAt and updatedAt fields
}
);
const GroupReport =
  models && models.GroupReport
    ? models.GroupReport
    : model("GroupReport", userReportSchema);

export default GroupReport;

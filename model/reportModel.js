import { Schema, model, models } from "mongoose";
import mongoose from 'mongoose';

const userReportSchema = new Schema(
  {
    ReportUser: {
        type: Schema.Types.ObjectId, ref: "User" 
    },
   PostReport:[{
    victimUser:{type: Schema.Types.ObjectId, ref: "User" },
    PostId:{type: Schema.Types.ObjectId, ref: "Post" },
    reason:{type:String}
   }],
   profileReport:[{
    victimUser:{type: Schema.Types.ObjectId, ref: "User" },
    reason:{type:String}

   }]
},
{
  timestamps: true, // Adds createdAt and updatedAt fields
}
);
const UserReport =
  models && models.UserReport
    ? models.UserReport
    : model("UserReport", userReportSchema);

export default UserReport;

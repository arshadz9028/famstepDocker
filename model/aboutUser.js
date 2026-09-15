import { Schema, model, models } from "mongoose";
import mongoose from 'mongoose';

const aboutSchema = new Schema(
  {
    user: {
        type: Schema.Types.ObjectId, ref: "User" 
    },
    experience:[{
        company:{ type: String, trim: true},
        Role:{ type: String, trim: true},
        joinMonth:{ type: String, trim: true},
        joinYear:{ type: String, trim: true},
        endMonth:{ type: String, trim: true},
        endYear:{ type: String, trim: true},
        description:{ type: String, trim: true},
        working: { type: Boolean},
      }],
      education:[{
        college:{ type: String, trim: true},
        university:{ type: String, trim: true},
        course:{ type: String, trim: true},
        joinMonth:{ type: String, trim: true},
        joinYear:{ type: String, trim: true},
        endMonth:{ type: String, trim: true},
        endYear:{ type: String, trim: true},
        description:{ type: String, trim: true},
        studying: { type: Boolean},
      }],
      project:[{
        name:{ type: String, trim: true},
        tech:{ type: String, trim: true},
        url:{ type: String, trim: true},
        joinMonth:{ type: String, trim: true},
        joinYear:{ type: String, trim: true},
        endMonth:{ type: String, trim: true},
        endYear:{ type: String, trim: true},
        description:{ type: String, trim: true},
        ongoing: { type: Boolean},
      }],
      social:{
        facebook:{ type: String, trim: true},
        github:{ type: String, trim: true},
        linkdIn:{ type: String, trim: true},
        twitter:{ type: String, trim: true},
        Instagram:{ type: String, trim: true},
      }
},
{
  timestamps: true, // Adds createdAt and updatedAt fields
}
);
const AboutUser =
  models && models.AboutUser
    ? models.AboutUser
    : model("AboutUser", aboutSchema);

export default AboutUser;

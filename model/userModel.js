import { Schema, model, models } from "mongoose";
// import defaultpic from "../public/default.png";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true }, ///pasword ko true karna hai
    image: { type: String, required: true, default: "/default.png" },
    contestNotification: { type: Boolean, default: false },
    background: { type: String, required: true, default: "/background.jpg" },
    Interests: [{ type: String, required: true, trim: true, default: [] }],
    verifiedTick: {
      color: {
        type: String, default: "" 
      },
     
    },
    collabNotification:{type: Boolean, default: false},
    skills: [
      {
        skill: { type: String },
        rank: { type: Number },
        points: { type: Number },
        achievements: { type: Number },
      },
    ],
    badges: {
      admin: {
         points: { type: Number, default: 0 } ,
        color: { type: String, default: "" } ,
      },
      knowledge:  {
        points: { type: Number, default: 0 } ,
       color: { type: String, default: "" } ,
     },
      judgment:  {
        points: { type: Number, default: 0 } ,
       color: { type: String, default: "" } ,
     },
      leader: {
        points: { type: Number, default: 0 } ,
       color: { type: String, default: "" } ,
     },
    },
    college: { type: String,  trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    designation: { type: String, trim: true,default: "" },
    statusIcons: { type: Array, trim: true, default: [] },
    praise: { type: Number, required: true, trim: true, default: 0 },
    rank: { type: Number, required: true, trim: true, default: 0 },
    level: { type: Number, required: true, trim: true, default: 0 },
    points: { type: Number, required: true, trim: true, default: 0 },
    achievements: { type: Number, required: true, trim: true, default: 0 },
    isNewUser: { type: Boolean, default: true }, // this field for identify that user is new or exist
    updateProfile: { type: Boolean, default: false }, // this field for identify that user is new or exist
    userEmailVerified: { type: Boolean, default: false }, // Add this field for email verification
    lastSeen: { type: Date },
    otp: { type: String, default: "" },
    userActive: { type: Boolean, default: false },
    userFeedback: { type: Boolean, default: false },
    role: { type: String },
    verified: { type: String, default: "" },
    userBio: { type: String, default: "" },
    authToken: { type: String, default: null },
    authTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

// const User = models.User || model("User", UserSchema);
const User = models && models.User ? models.User : model("User", UserSchema);

export default User;

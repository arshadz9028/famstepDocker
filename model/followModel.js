import { Schema, model, models } from "mongoose";
import mongoose from 'mongoose';

const userFollowSchema = new Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    following: [
      {
        userid: {
          type: String,
          ref: "User",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
        postNotification: { type: Boolean },

      }
    ],
    praise: [
      {
        userid: {
          type: String,
          ref: "User",
          required: true,
        }
      }
    ],
    groupsAdded: [
      {
        grpId: {
          type: String,
          ref: "CreateGroup",
          required: true,
        },
      }
    ],
    followers: [
      {
        userid: {
          type: String,
          ref: "User",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },



      }
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const UserFollow =
  models && models.UserFollow
    ? models.UserFollow
    : model("UserFollow", userFollowSchema);

export default UserFollow;

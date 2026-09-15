import { Schema, model, models } from "mongoose";
import mongoose from 'mongoose';

const frequestSchema = new Schema(
  {
    user: {
      type: String,
      ref: "User", // The name of the User model
      required: true,
    },


    followRequests: [
      {
        userid: {
          type: String,
          ref: "User",
          required: true,
        },

        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        notification: { type: Boolean },
        NetNotification: { type: Boolean },
        IsAccepted: { type: Boolean },
        followStatus: { type: String }
      }, {
        timestamps: true, // Adds createdAt and updatedAt fields
      }
    ],
    groupInvites: [
      {
        admin: {
          type: String,
          ref: "User",
          required: true,
        },
        groupId: {
          type: String, ref: "CreateGroup",
          required: true,
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        grpNotification: { type: Boolean },
        GamepadEventrpNetNotification: { type: Boolean },
        IsAcctdInvite: { type: Boolean },
        inviteStatus: { type: String }
      }, {
        timestamps: true, // Adds createdAt and updatedAt fields
      }
    ]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// const frequests = models.frequest || model("frequest", frequestSchema);
const frequests = models && models.frequest ? models.frequest : model("frequest", frequestSchema);

export default frequests;

import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const CollabModel = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    groupId: {
      type: String,
    },

    title: {
      type: String,
    },

    roles: [
      {
        count: {
          type: Number,
        },
        role: {
          type: String,
        },
        skills: {
          type: [String], // Array of strings
          required: true,
        },
      },
    ],

    durationReq: {
      type: String,
    },

    collaborationType: {
      type: String,
    },

    rate: {
      type: Number,
    },

    desc: {
      type: String,
    },

    collabRequests: [
      {
        timeRequired:{ type: String},
        userid: {
          type: String,
          ref: "User",
          required: true,
        },
        createdAt: { type: Date },
        updatedAt: { type: Date },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        collabID: { type: String },
        title: {
          type: String,
        },

        tasks: {
          status: {
            type: String,
          },
          dueDate: {
            type: String,
          },
          priority: {
            type: String,
          },
          attachment: {
            type: String,
          },
          description: {
            type: String,
          },

          attachments: [
            {
              file: { type: String },
            },
          ],
          comments: [
            {
              comment: { type: String },
              commentAttachment: { type: String },
              commentUser: { type: String, ref: "User" },
              createdAt: { type: Date },
            },
            {
              timestamps: true,
            },
          ],
        },
        proposals: [
          {
            // userid: {
            //   type: String,
            //   ref: "User",
            //   required: true,
            // },

            skills: [
              {
                skill: { type: String },
              },
            ],
            coverLetter: { type: String },
            rate: {
              type: String,
            },
            attachProof: {
              type: String,
            },
            approach: {
              type: String,
            },
            title: {
              type: String,
            },
          },
        ],
        // createdAt: { type: Date, default: Date.now },
        // updatedAt: { type: Date, default: Date.now },
        notification: { type: Boolean },
        IsAccepted: { type: Boolean },
        userCollab: { type: Boolean },

        // followStatus: { type: String }
      },
      {
        timestamps: true, // Adds createdAt and updatedAt fields
      },
    ],
    tag: [
      {
        userid: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    likes: {
      type: [
        {
          username: String,
          user: { type: Schema.Types.ObjectId, ref: "User" },
          isViewedLike: { type: Boolean, default: false },
        },
      ],
    },

    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: "",
      },
    ],
  },
  {
    timestamps: true,
  }
);
// const Post =   models.Post || model("Post", PostSchema)
const Collab =
  models && models.Collab ? models.Collab : model("Collab", CollabModel);
export default Collab;

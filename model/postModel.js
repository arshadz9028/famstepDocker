import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";

const PostModel = new mongoose.Schema(
  {
    desc: {
      type: String,
    },
    groupId: {
      type: String,
    },
    images: {
      type: [{ image: String }],
      default: [{ image: "" }],
      sparse: true,
    },
    languageTag:{
      type:String,
      sparse: true,
      default:"",
    },
    
    isGrpPost: {
      type: Boolean,
    },
    pracsUrl: {
      type: String,
      sparse: true,
    },
    outputUrl: {
      type: String,
      sparse: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tag: [
      {
        userid: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // name: {type: String, required: true,trim: true},
    // username: {type: String, required: true, trim: true},
    // userImage: {type: String, required:true, default: "/default.png" },
    likes: {
      type: [
        {
          username: String,
          user: { type: Schema.Types.ObjectId, ref: "User" },
          isViewedLike: { type: Boolean, default: false },
        },
      ],
    },

    commentsEnable: { type: Boolean },
    collections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: "",
      },
    ],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
        isViewedComment: { type: Boolean, default: false },
        like: {
          type: [{ username: String }],
        },
        reply: [
          {
            ReplyUser: { type: Schema.Types.ObjectId, ref: "User" },
            ReplyComment: { type: String },
            createdAt: { type: Date, default: Date.now },
            likeReply: {
              type: [{ username: String }],
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);
// const Post =   models.Post || model("Post", PostSchema)
const Post = models && models.Post ? models.Post : model("Post", PostModel);
export default Post;

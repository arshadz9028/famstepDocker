import connectDb from "../../../database/conn";
import Post from "../../../model/postModel";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();
    const { grpId, page = 1, limit = 5 } = req.query;

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const skip = (page - 1) * limit;

    let posts = await Post.find({ isGrpPost: true, groupId: grpId })
      .populate("userid", "name username image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    posts = await User.populate(posts, [
      { path: "comments.user", select: "name username image" },
      { path: "comments.reply.ReplyUser", select: "name username image" },
      { path: "likes.user", select: "name username image" },
      { path: "tag.userid", select: "name username" },

    ]);

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

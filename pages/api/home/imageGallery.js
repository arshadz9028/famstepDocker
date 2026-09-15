import connectDb from "../../../database/conn";
import Post from "../../../model/postModel";
import User from "../../../model/userModel";
import UserFollow from "../../../model/followModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const userId = session.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const userFollowData = await UserFollow.findOne({ user: userId }).lean();
    const followingIds = userFollowData?.following.map(follow => follow.userid.toString()) || [];

    // Add the logged-in user ID to the array of following IDs
    followingIds.push(userId);

    // Fetch posts with pagination, filtering for posts that belong to the logged-in user or their followings
    let postData = await Post.find({

      isGrpPost: false,
      // userid: { $in: followingIds }
    })
      .populate("userid", "name username image")
      .sort({ createdAt: -1 }
      ) // Sort by most recent first
      .skip(skip)
      .limit(limit)
      .lean();

    postData = await User.populate(postData, [
      { path: "comments.user", select: "name username image" },
      { path: "comments.reply.ReplyUser", select: "name username image" },
      { path: "likes.user", select: "name username image" },
      { path: "tag.userid", select: "name username" },
    ]);

    res.status(200).json({ success: true, data: postData });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

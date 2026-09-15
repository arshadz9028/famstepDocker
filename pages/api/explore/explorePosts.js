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

    // Fetch page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Fetch the user's followings
    const userFollowData = await UserFollow.findOne({ user: userId }).lean();
    const followingIds =
      userFollowData?.following.map((follow) => follow.userid.toString()) || [];

    // Add the user's own ID to the exclusion list
    followingIds.push(userId);

    // Fetch posts with pagination
    let posts = await Post.find({
      // isGrpPost: false,
      userid: { $nin: followingIds },
    })
      .populate("userid", "name username image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Filter posts to exclude the user's own posts and followings' posts
    posts = posts.filter((post) => {
      const isFollowing = userFollowData?.following.some(
        (follow) => follow.userid.toString() === post.userid?._id.toString()
      );
      const isOwnPost = post?.userid?.username === session?.user.username;
      return !isFollowing && !isOwnPost;
    });

    // Populate user data for comments and likes
    posts = await User.populate(posts, [
      { path: "comments.user", select: "name username image" },
      { path: "comments.reply.ReplyUser", select: "name username image" },
      { path: "likes.user", select: "name username image" },
    ]);

    res.status(200).json({ success: true, data: posts, page });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

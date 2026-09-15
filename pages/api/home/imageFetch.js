import connectDb from "../../../database/conn";
import Post from "../../../model/postModel";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    let userPostId;
    const { profile } = req.query;
    const famstep = '66e4a234016f471b2ea619c6'
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    if (profile) {
      userPostId = profile;
    } 
    else if(famstep === profile){
      userPostId = famstep
    }
    
    else {
      userPostId = session?.user.id;
    }
    // Ensure userPostId is valid
    if (!userPostId) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    // Find the post using the userPostId
    let postData = await Post.find({isGrpPost: false, userid: userPostId }) // Assuming you want to find the post by its _id

      .populate("userid", "name username image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    // If postData is null, return a 404 error
    postData = await User.populate(postData, [
      { path: "comments.user", select: "name username image" },
      { path: "comments.reply.ReplyUser", select: "name username image" },
      { path: "likes.user", select: "name username image" },
      { path: "tag.userid", select: "name username" },
    ]);

    res.status(200).json({ success: true, data: postData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

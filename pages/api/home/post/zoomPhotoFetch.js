import connectDb from "../../../../database/conn";
import Post from "../../../../model/postModel";
import User from "../../../../model/userModel";

export default async function handler(req, res) {
  try {
    await connectDb();
    const { CommentId } = req.query;
    const { userPostId } = req.query;
    let post = await Post.findById(userPostId).populate(
      "userid",
      "name username image"
    );

    post = await User.populate(post, {
      path: "comments.user",
      select: "name username image",
    });
    post = await User.populate(post, {
      path: "comments.reply.ReplyUser",
      select: "name username image",
    });

    res.status(200).json({ data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

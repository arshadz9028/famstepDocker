import connectDb from "../../../../database/conn";
import Post from "../../../../model/postModel";
import { getSession } from "next-auth/react";
import mongoose from "mongoose";

const MAX_RETRIES = 3;

export default async function handler(req, res) {
  const { method } = req;

  if (method === "POST") {
    const { userPostId, CommentId } = req.query;

    try {
      // Connect to the database
      await connectDb();

      // Get the user session
      const session = await getSession({ req });
      if (!session?.user?.username) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const username = session.user.username;

      // Retry mechanism
      let attempts = 0;
      let success = false;
      while (attempts < MAX_RETRIES && !success) {
        try {
          // Find the post by its ID
          const post = await Post.findById(userPostId).exec();

          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }

          // Find the comment by its ID
          const comment = post.comments.id(CommentId);
          if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
          }

          // Check if the user has already liked the comment
          const likedByUser = comment.like.some(
            (likes) => likes.username === username
          );

          if (!likedByUser) {
            // If the user hasn't liked the comment, add a new like
            comment.like.push({ username });
          } else {
            // If the user has already liked the comment, remove the like
            comment.like = comment.like.filter(
              (likes) => likes.username !== username
            );
          }

          await post.save();
          success = true;
          return res
            .status(200)
            .json({ success: !likedByUser ? true : "dislike", data: comment });
        } catch (error) {
          if (error instanceof mongoose.Error.VersionError) {
            attempts++;
            console.warn(`Retrying update (${attempts}/${MAX_RETRIES})`);
          } else {
            console.error("Unexpected error:", error);
            return res.status(500).json({ message: "Server error" });
          }
        }
      }

      if (!success) {
        return res
          .status(500)
          .json({ message: "Failed to update comment after multiple attempts" });
      }
    } catch (error) {
      console.error("Final error after retries:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    // Return an error for other HTTP methods
    res.status(405).json({ message: "Method not allowed" });
  }
}

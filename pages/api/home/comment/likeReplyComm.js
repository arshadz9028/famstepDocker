import connectDb from "../../../../database/conn";
import Post from "../../../../model/postModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    try {
      // Connect to the database
      await connectDb();

      // Get the user session
      const session = await getSession({ req });
      if (!session?.user?.username) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const username = session.user.username;

      // Extract userPostId and CommentId from req.query
      const { userPostId, CommentId } = req.query;

      // Find the post by its ID
      const post = await Post.findById(userPostId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Find the comment and reply by their IDs
      let foundComment;
      let foundReply;
      for (const comment of post.comments) {
        const reply = comment.reply.find(reply => reply._id.toString() === CommentId);
        if (reply) {
          foundComment = comment;
          foundReply = reply;
          break;
        }
      }

      if (!foundComment || !foundReply) {
        return res.status(404).json({ message: 'Comment or reply not found' });
      }

      // Check if the user has already liked the reply
      const likedByUser = foundReply.likeReply.some(likes => likes.username === username);

      if (!likedByUser) {
        // If the user hasn't liked the reply, add a new like
        foundReply.likeReply.push({ username });
      } else {
        // If the user has already liked the reply, remove the like
        foundReply.likeReply = foundReply.likeReply.filter(likes => likes.username !== username);
      }

      // Save the changes to the post document
      await post.save();

      return res.status(200).json({ success: !likedByUser ? true : 'dislike', data: foundReply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    // Return an error for other HTTP methods
    res.status(405).json({ message: "Method not allowed" });
  }
}

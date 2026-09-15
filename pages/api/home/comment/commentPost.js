import connectDb from "../../../../database/conn";
import Post from "../../../../model/postModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    try {
      // Connect to the database
      await connectDb();

      // Retrieve the session information
      const session = await getSession({ req });
      const {  id: userId, image: userDp, name: username } = session.user;

      const { userPostId } = req.query;
      const { comment } = req.body;
      const { userCommentId } = req.body;

      // Find the post by its ID
      const post = await Post.findById(userPostId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Add the new comment to the post's comments array
      post.comments.push({
        comment: comment,
        user: userId,
        createdAt: Date.now(),
        like: [],
        reply: []
      });

      // Save the updated post to the database
      const updatedPost = await post.save();

      // Return the updated post as JSON
      res.status(200).json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else if (method === 'DELETE') {
    try {
      // Connect to the database
      await connectDb();

      // Retrieve the session information
      const session = await getSession({ req });
      const { userCommentId,createId } = req.query;

      // Find the post by its ID
      const post = await Post.findById(createId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      // Find the comment to be deleted and remove it from the post's comments array
      const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === userCommentId);

      if (commentIndex === -1) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      // Remove the comment from the post's comments array
      post.comments.splice(commentIndex, 1);

      // Save the updated post to the database
      const updatedPost = await post.save();

      res.status(200).json({ success: true, data: updatedPost });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: `Method ${method} not allowed` });
  }
}

import connectDb from "../../../../database/conn";
import Post from "../../../../model/postModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    try {
      await connectDb();
      const { userPostId, CommentId } = req.query;
      const { comment } = req.body;

      const session = await getSession({ req });

      if (!session?.user?.username) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { id: userId } = session.user;

      let post = await Post.findById(userPostId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const commentOrReply = post.comments.find(comment => 
        comment._id.toString() === CommentId || 
        comment.reply.some(reply => reply._id.toString() === CommentId)
      );
      
      if (!commentOrReply) {
        return res.status(404).json({ message: 'Comment or reply not found' });
      }
      
      const replyToComment = commentOrReply.reply.find(reply => reply._id.toString() === CommentId);
      
      if (!commentOrReply) {
        // Handle replying to a reply
        replyToComment.reply.push({
          ReplyComment: comment,
          ReplyUser: userId,
          createdAt: Date.now(),
          likeReply:[]
        });
      } else {
        // Handle replying to the original comment
        commentOrReply.reply.push({
          ReplyComment: comment,
          ReplyUser: userId,
          createdAt: Date.now(),
          likeReply:[]
        });
      }
      
      await post.save();
      
      return res.status(200).json({ success: true, data: commentOrReply });
      
   
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }  
   else  if (method === 'DELETE') {
    try {
      await connectDb();
      const { createId, userCommentId } = req.query;

      const session = await getSession({ req });

      if (!session?.user?.username) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const post = await Post.findById(createId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      let commentOrReply;
      let replyIndex = -1;
      
      for (let i = 0; i < post.comments.length; i++) {
        const comment = post.comments[i];
        replyIndex = comment.reply.findIndex(reply => reply._id.toString() === userCommentId);
        if (replyIndex !== -1) {
          commentOrReply = comment;
          break;
        }
      }

      if (!commentOrReply || replyIndex === -1) {
        return res.status(404).json({ message: 'Reply not found' });
      }

      // Remove the reply from the comment's reply array
      commentOrReply.reply.splice(replyIndex, 1);

      // Save the updated post to the database
      await post.save();

      res.status(200).json({ success: true, message: 'Reply deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
import connectDb from "../../../../database/conn";
import Post from "../../../../model/postModel";

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    try {
      const { createId } = req.query;

      // Connect to the database
      await connectDb();

      // Retrieve the post by its ID
      const post = await Post.findById(createId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found.' });
      }

      // Set commentsEnable to false and save the post
      if(post.commentsEnable === true){
          post.commentsEnable = false;
          await post.save();
        }
        else{
        post.commentsEnable = true
        await post.save()
      }
      return res.status(200).json({ success: true, data: post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed.' });
  }
}

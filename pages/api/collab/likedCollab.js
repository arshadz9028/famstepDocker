import { getSession } from "next-auth/react";
import connectDb from "../../../database/conn";
import Collab from "../../../model/collab";
export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    if (req.method === "PUT") {
      const { id } = req.body;
      // const { id } = req.query;
    
      const userName = session.user.username;
      const userid = session.user.id;
    
      try {
        let post = await Collab.findById(id);
    
        if (!post) {
          return res.status(404).json({ success: false, message: "Post not found" });
        }
    
        if (!post.likes.some((like) => like.username === userName)) {
          post.likes.push({ username: userName , user:userid});
          await post.save();
         
          return res.status(200).json({ success: true, data: post });
        } else {
          post.likes = post.likes.filter((like) => like.username !== userName);
          await post.save();
          return res.status(200).json({ success: 'dislike', data: post });
        }
    
      } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
      }
    }
    
    else {
      res.status(405).json({ message: "Method not allowed" });
    }
    

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

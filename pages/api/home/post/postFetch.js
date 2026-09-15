import Post from "../../../../model/postModel";
import connectDb from "../../../../database/conn";
export default async function handler(req, res) {
  try {
    await connectDb();
    let post = await Post.find();
    return res.status(200).json({ success: true, data: post });
  }

catch{}
}
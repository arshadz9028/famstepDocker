import connectDb from "../../../../database/conn";
import { getSession } from "next-auth/react";
import Post from "../../../../model/postModel";
import { awsS3 } from "../../../../config/awsS3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { postUpdate, mainImg } = req.query;
    const post = await Post.findById(mainImg);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the image to delete by matching postUpdate with the image _id
    const key = post.images.find((image) => image._id == postUpdate);

    if (!key) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Extract the S3 key from the image URL
    const finalKey = key.image.replace(
      "https://famstep-storage.s3.ap-south-1.amazonaws.com/",
      ""
    );

    const deleteParams = {
      Bucket: "famstep-storage",
      Key: finalKey,
    };

    await awsS3.send(new DeleteObjectCommand(deleteParams));

    post.images = post.images.filter((img) => img._id != postUpdate);
    await post.save();

    return res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

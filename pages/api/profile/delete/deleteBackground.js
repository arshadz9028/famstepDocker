import connectDb from "../../../../database/conn";
import { createRouter, expressWrapper } from "next-connect";
import { getSession } from "next-auth/react";
import { upload } from "../../../../config/multerMiddleware";
import User from "../../../../model/userModel";
import followModel from "../../../../model/followModel";
import { awsS3 } from "../../../../config/awsS3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    if (req.method === "DELETE") {

      const currentUser = session?.user?.id;
      const defaultImage = '/background.jpg'
      const user = await User.findById(currentUser);
      if (!user) {
        return res.status(404).json({ error: "user not found." });
      }
      const key = user.background.replace('https://famstep-storage.s3.ap-south-1.amazonaws.com/','');
      const deleteParams = {
        Bucket: "famstep-storage",
        Key: key,
      };

      try {
        await awsS3.send(new DeleteObjectCommand(deleteParams));
      } catch (error) {
        console.error("Error deleting image from S3:", error);
        return res.status(500).json({ error: "Failed to delete image from S3." });
      }
      await User.findByIdAndUpdate(currentUser, { background: defaultImage });
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

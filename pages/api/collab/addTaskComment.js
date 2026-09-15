import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import User from "../../../model/userModel";
import { awsS3 } from "../../../config/awsS3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import mongoose from "mongoose"; // Import mongoose for ObjectId generation

export const config = {
  api: {
    bodyParser: false, // Disables default body parsing (needed for multer)
  },
};

const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  try {
    // Connect to the database
    await connectDb();

    // Get the session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    upload.single("attach_file2")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload failed" });
      }
      // if (!req.file) {
      //   return res.status(400).json({ message: "No file uploaded" });
      // }
      const { projectTask, assigneeId } = req.body;

      const { originalname, buffer, mimetype } = req.file;
      const userId = session?.user?.id;
      const timestamp = Date.now();
      const uniqueFilename = `collab/${userId}/${timestamp}-${originalname}`;

      const uploadParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: uniqueFilename,
        Body: buffer,
        ContentType: mimetype,
      };

      await awsS3.send(new PutObjectCommand(uploadParams));

      const attachementUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;

      // Generate a unique commentId
      const commentId = new mongoose.Types.ObjectId();

      // Use findOneAndUpdate to avoid version conflicts
      const updatedProjectData = await Collab.findOneAndUpdate(
        { _id: projectTask, "collabRequests.userid": assigneeId }, // Match the project and the specific collaborator
        {
          $push: {
            "collabRequests.$.tasks.comments": {
              _id: commentId, // Add the generated commentId
              commentAttachment: attachementUrl,
              commentUser: session?.user.id,
              createdAt: new Date(),
            },
          },
        },
        { new: true } // Return the updated document
      );

      if (!updatedProjectData) {
        return res.status(404).json({ success: false, error: "Collaborator not found or project not found" });
      }

      return res.status(200).json({ success: true, data: attachementUrl, commentId: commentId.toString() });
    });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

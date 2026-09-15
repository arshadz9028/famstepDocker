import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import { awsS3 } from "../../../config/awsS3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      const { projectTask, assigneeId, fileUrl } = req.query;
      if (!fileUrl) {
        return res.status(400).json({ message: "File URL is required" });
      }

      const projectData = await Collab.findById(projectTask);
      if (!projectData) {
        return res.status(404).json({ success: false, error: "Project not found" });
      }

      const collabUser = projectData.collabRequests.find(
        (value) => value.userid === assigneeId
      );

      if (!collabUser || !collabUser.tasks.attachment) {
        return res.status(404).json({ success: false, error: "Attachment not found" });
      }

      // Extract the file key from the S3 URL
      const fileKey = fileUrl.split(`.amazonaws.com/`)[1];

      if (!fileKey) {
        return res.status(400).json({ message: "Invalid file URL" });
      }

      // Delete the file from S3
      const deleteParams = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: fileKey,
      };

      await awsS3.send(new DeleteObjectCommand(deleteParams));

      // Remove the attachment reference from the database
      collabUser.tasks.attachment = null;
      await projectData.save();

      return res.status(200).json({ message: "File deleted successfully",data:projectData });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

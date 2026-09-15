import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import { awsS3 } from "../../../config/awsS3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import { promisify } from "util";

// Configure multer for handling file uploads
export const config = {
  api: {
    bodyParser: false, // Disables default body parsing (needed for multer)
  },
};

const upload = multer({ storage: multer.memoryStorage() });

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "POST") {
      // Handle file upload
      upload.single("attach_file")(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: "File upload failed" });
        }

        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
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
        const projectData = await Collab.findById(projectTask);
        if (!projectData) {
          return res
            .status(404)
            .json({ success: false, error: "Project not found" });
        }
        const collabUser = projectData.collabRequests.find(
          (value) => value.userid === assigneeId
        );
        if (!collabUser) {
          return res
            .status(404)
            .json({ success: false, error: "Collaborator not found" });
        }
        const attachementUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`
        
        // Update only the attachment field while preserving other task data
        if (!collabUser.tasks) {
          collabUser.tasks = {};
        }
        collabUser.tasks.attachment = attachementUrl;

        await projectData.save();
       

        return res.status(200).json({ message: "File uploaded successfully",data:attachementUrl });
      });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

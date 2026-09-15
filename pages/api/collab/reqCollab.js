import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import { awsS3 } from "../../../config/awsS3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
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

    // Validate user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session?.user?.id;

    if (req.method === "PUT") {
      upload.single("attachProof")(req, res, async (err) => {
        const { collabId } = req.query;
        const { title, description, approach, rate, selectedColab } = req.body;
        let attachementUrl;
        if (req.file) {
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
          attachementUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;
        }

        let parsedSkills = [];
        if (selectedColab) {
          try {
            parsedSkills = JSON.parse(selectedColab);
            if (!Array.isArray(parsedSkills)) {
              parsedSkills = [];
            }
          } catch (error) {
            console.error("Error parsing selectedColab:", error);
          }
        }

        // Format skills correctly
        const formattedSkills = parsedSkills.map((skill) => ({ skill }));
        if (!collabId) {
          return res.status(400).json({ message: "Collab ID is required" });
        }

        try {
          const collab = await Collab.findById(collabId);

          if (!collab) {
            return res.status(404).json({ message: "Collab not found" });
          }

          const existingRequest = collab.collabRequests.find(
            (request) => request.userid === userId
          );

          if (!existingRequest) {
            collab.collabRequests.push({
              userid: userId,
              owner: collab?.userid,
              collabID: collabId,
              title: collab.title,
              notification: true,
              userCollab: false,
              IsAccepted: false,
              timeRequired: collab.durationReq,
              createdAt: new Date(),
              updatedAt: new Date(),
              proposals: [
                {
                  // userid: userId,
                  skills: formattedSkills || [],
                  coverLetter: description,
                  rate: rate,
                  attachProof: attachementUrl,
                  approach,
                  title,
                },
              ],
            });
          }

          await collab.save();

          return res
            .status(200)
            .json({ message: "Collab request updated successfully" });
        } catch (error) {
          console.error("Error updating collab request:", error);
          return res
            .status(500)
            .json({ message: "Error updating collab request" });
        }
      });
    } else {
      // Handle unsupported HTTP methods
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

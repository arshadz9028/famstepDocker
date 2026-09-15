import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";

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

    // Handle POST request
    if (req.method === "PUT") {
      const { collabId, reqId } = req.query;

      try {
        // Find the collab by ID
        const collab = await Collab.findOneAndUpdate(
          {"_id": collabId, "collabRequests._id": reqId },
          {
            $set: {
              "collabRequests.$.IsAccepted": true,
              "collabRequests.$.userCollab": true,
              "collabRequests.$.updatedAt": new Date(),
            },
            $push: {
              tasks: {
                status: "pending", // Provide a default value or meaningful status
                dueDate: "TBD", // Example placeholder
                priority: "normal",
                attachments: [],
                comments: [],
              },
            },
          },
          { new: true }
        );

        if (!collab) {
          return res.status(404).json({ message: "Collab not found" });
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
    } else if (req.method === "DELETE") {
      try {
        const { collabId, reqId } = req.query;
        if (!collabId || !reqId) {
          return res.status(400).json({ message: "Missing collabId or reqId" });
        }

        // Find and update the document by removing the specific collab request
        const collab = await Collab.findOneAndUpdate(
          { _id: collabId },
          { $pull: { collabRequests: { _id: reqId } } },
          { new: true }
        );

        if (!collab) {
          return res.status(404).json({ message: "Collab not found" });
        }

        return res
          .status(200)
          .json({ message: "Collab request deleted successfully", collab });
      } catch (error) {
        console.error("Error deleting collab request:", error);
        return res
          .status(500)
          .json({ message: "Error deleting collab request" });
      }
    } else {
      // Handle unsupported HTTP methods
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

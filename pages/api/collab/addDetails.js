import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import User from "../../../model/userModel";
export default async function handler(req, res) {
  try {
    connectDb().catch((error) => res.json({ error: "connection failed...!" }));
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.method === "POST") {
      const { projectData } = req.body;
      // Validate projectData
      if (!projectData || !projectData.title || !projectData.roles ) {
        return res.status(400).json({ message: "Missing required fields in projectData" });
      }

      try {
        // Get session and userId
        const session = await getSession({ req });
        if (!session) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = session?.user?.id;;

        // Format roles and skills
        const formattedRoles = projectData.roles.map(({ count, role, skills }) => ({
          count,
          role,
          skills: skills.map(skill => skill)
        }));


        // Create new collab post
        const collabPost = new Collab({
          userid: userId,
          title: projectData.title,
          roles: formattedRoles,
          durationReq: projectData.durationReq,
          collaborationType: projectData.collaborationType,
          rate: projectData.rate,
          desc: projectData.description || "",
          collabRequests: [],
        });

        // Save the collab post
        await collabPost.save();

        // Update user notifications (optional, depending on your use case)
        await User.updateMany(
          { _id: { $ne: userId } },
          { $set: { collabNotification: true } }
        );

        return res.status(200).json({
          message: "Collab post added successfully",
          data: collabPost,
        });
      } catch (error) {
        console.error("Error creating collab post:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    } else if (req.method === "PUT") {
      const { projectData, collabID } = req.body;

      if (!collabID) {
        return res.status(400).json({ message: "Collab ID is required" });
      }

      try {
        // Format roles and skills
        const formattedRoles = projectData.roles.map(({ count, role, skills }) => ({
          count,
          role,
          skills: skills.map(skill => skill), // Ensure skills are properly formatted
        }));
    
        // Update the collab post
        const updatedCollab = await Collab.findByIdAndUpdate(
          collabID,
          {
            title: projectData.title,
            roles: formattedRoles,
            durationReq: projectData.durationReq,
            collaborationType: projectData.collaborationType,
            rate: projectData.rate,
            desc: projectData.description || "",
          },
          { new: true, runValidators: true } // Return the updated document and run validators
        );
    
        if (!updatedCollab) {
          return res.status(404).json({ message: "Collab not found" });
        }
    
        return res.status(200).json({
          message: "Collab post updated successfully",
          data: updatedCollab,
        });
      } catch (error) {
        console.error("Error updating collab:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

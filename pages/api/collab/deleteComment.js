import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import User from "../../../model/userModel";
export default async function handler(req, res) {
    try {
      connectDb()
    //   .catch((error) => res.json({ error: "connection failed...!" }));
      const session = await getSession({ req });
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (req.method === "DELETE") {
        const { projectTask,commentId,assigneeId } = req.query;
        // Validate projectData
        const projectData = await Collab.findById(projectTask);
      
  
        const collabUser = projectData.collabRequests.find(
          (value) => value.userid === assigneeId
        );        
        const comments = collabUser.tasks.comments || [];
        const commentIndex = comments.findIndex(comment => comment._id.toString() === commentId);   
        if (commentIndex === -1) {
          return res.status(404).json({ success: false, error: "Comment not found" });
        }
        // Remove the comment from the array
        comments.splice(commentIndex, 1);   
        // Save the updated project data
        await projectData.save();
        return res.status(200).json({ message: "Comment deleted successfully",data:projectData });
        console.log("projectTask12",collabUser);

    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

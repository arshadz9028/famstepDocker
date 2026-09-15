import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import User from "../../../model/userModel";

export default async function handler(req, res) {
  try {
    // Connect to the database
    await connectDb();

    const { tasks } = req.body;
    const { projectTask } = req.query;
    const { assigneeId, progress, dueDate, priority, description, attachments, commentValue } = tasks;

    // Verify user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Find the project
    const projectData = await Collab.findById(projectTask);
    if (!projectData) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }

    // Find the collaborator
    const collabUser = projectData.collabRequests.find(
      (value) => value.userid === assigneeId
    );
    if (!collabUser) {
      return res.status(404).json({ success: false, error: "Collaborator not found" });
    }

    // Handle comment addition
    if (commentValue) {
      const newComment = {
        comment: commentValue,
        commentUser: session.user.id,
        createdAt: new Date(),
      };
      collabUser.tasks = collabUser.tasks || {};
      collabUser.tasks.comments = collabUser.tasks.comments || [];
      collabUser.tasks.comments.push(newComment);
    }

    // Update collaborator tasks
    collabUser.tasks = {
      ...collabUser.tasks,
      status: progress,
      dueDate,
      priority,
      description,
      attachments: attachments || [],
    };

    // Save updated project data
    await projectData.save();

    return res.status(200).json({ success: true, data: projectData });
  } catch (error) {
    console.error("Error updating tasks:", error.message);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

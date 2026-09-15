import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { projectTask, assigneeId } = req.query;
    const { status } = req.body;

    if (req.method === "PUT") {
        const projectData = await Collab.findById(projectTask);

        const collabUser = projectData.collabRequests.find(
            (value) => value.userid === assigneeId
          );
          collabUser.tasks = {
            status
          }

          await projectData.save();
          return res.status(200).json({ success: true, data: projectData });

    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

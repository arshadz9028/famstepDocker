import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";

export default async function handler(req, res) {
  try {
    connectDb().catch((error) => res.json({ error: "connection failed...!" }));
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = session?.user?.id;
    if (req.method === "POST") {
      const { projectData } = req.body;
      try {
        const formattedSkills = projectData?.selectedColab?.map((skill) => ({
          skill,
        }));

        const collabPost = new Collab({
          desc: projectData?.description || "",
          userid: userId,
          skills: formattedSkills || [],
          title: projectData?.title,
          timeRequired: projectData?.timeRequired,
          collabRequests: [
            {
              userid: userId, // Example default entry
              notification: true,
              IsAccepted: false,
              userCollab:false
            },
          ],
        });
        
        await collabPost.save();
      } catch (error) {
        return res.status(403).json({ message: error });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

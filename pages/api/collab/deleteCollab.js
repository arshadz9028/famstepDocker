import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";

export default async function handler(req, res) {
  try {
    await connectDb();

    if (req.method !== "DELETE") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const { collabId } = req.query;
    if (!collabId) {
      return res.status(400).json({ success: false, error: "Collab ID is required" });
    }

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const postCollab = await Collab.findByIdAndDelete(collabId);
    if (!postCollab) {
      return res.status(404).json({ success: false, error: "Collab not found" });
    }

    return res.status(200).json({ success: true, data: postCollab });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

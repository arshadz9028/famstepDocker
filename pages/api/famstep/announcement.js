import Famstep from "../../../model/famstepOfficial";
import connectDb from "../../../database/conn";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  try {
    await connectDb();

    const { announcement } = req.body;

    if (!announcement) {
      return res.status(400).json({ success: false, error: "Announcement is required" });
    }

    // Check if any document exists in the `Famstep` collection
    let famstep = await Famstep.findOne();

    if (famstep) {
      // Document exists, so update the announcement
      famstep.announcement = announcement;
      famstep = await famstep.save();
    } else {
      // No document exists, create a new one
      famstep = await Famstep.create({ announcement });
    }

    return res.status(201).json({ success: true, data: famstep });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

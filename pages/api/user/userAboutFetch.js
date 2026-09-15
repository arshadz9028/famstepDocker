import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import AboutUser from "../../../model/aboutUser";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session.user.id;
   

    // Find userAbout data
    const userAbout = await AboutUser.findOne({ user: userId });

    if (!userAbout) {
      return res.status(404).json({ success: false, message: "UserAbout not found" });
    }

    return res.status(200).json({ success: true,  data: userAbout });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

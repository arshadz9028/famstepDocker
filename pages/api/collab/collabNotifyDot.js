import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";

import User from "../../../model/userModel";
export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    await User.findByIdAndUpdate(
      session.user.id,
      {
        collabNotification: false,
      },
      { new: true }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    const userId = session.user.id;
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await User.findByIdAndRemove(userId);
    return res.status(200).json({
      success: true,
      message: "User Experience updated",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

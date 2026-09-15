import connectDb from "../../../database/conn";
import Feedback from "../../../model/feedback";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";
export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const session = await getSession({ req }); // Ensure session is fetched correctly
      if (session) {
        const userId = session.user.id;

        const user = await User.findByIdAndUpdate(
          userId,
          { userFeedback: false },
          { new: true }
        );

        if (!user) {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }

        return res.status(200).json({ success: true, data: user });
      }
    } catch (error) {
      console.error("Error updating user feedback:", error);
      return res.status(500).json({ success: false, error: "Server error" });
    }
  }
}

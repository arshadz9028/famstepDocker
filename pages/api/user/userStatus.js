import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });

    if (session) {
      if (req.method === "PUT") {
        const { isActive, timestamp, userId } = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, {
          userActive: isActive,
          lastSeen: timestamp,
        });
        if (!updatedUser) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
        const usersActive = await User.find({
          userActive: true,
        });
        const io = req.socket.server.io;
        if (io) {
          io.emit("activeUsersCount", usersActive.length);
        }
        return res.status(200).json({
          success: true,
          message: "User status updated",
          user: updatedUser,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid request method" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "The user has logged out." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

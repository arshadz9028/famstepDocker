import User from "../../../model/userModel";
import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const userId = session.user.id;

  await connectDb();

  try {
    // Find the user by username
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

       // You can map the sortedUserData here or perform any other operations

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

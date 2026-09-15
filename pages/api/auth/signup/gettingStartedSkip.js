import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;

    await connectDb();

    // Corrected the method check to uppercase "POST"
    if (req.method === "POST") {
      const { hobbyOption } = req.body.values;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          Interests: hobbyOption,
          updateProfile: true,
          userFeedback: true,
              isNewUser: false,
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "User information updated successfully." });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

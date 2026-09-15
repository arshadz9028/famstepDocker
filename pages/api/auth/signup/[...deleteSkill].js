import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const userId = session.user.id;

  try {
    await connectDb();

    if (req.method === "DELETE") {
      const  {deleteSkill}  = req.query;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { skills: { _id: deleteSkill } } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "Skill deleted successfully.", user: updatedUser });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

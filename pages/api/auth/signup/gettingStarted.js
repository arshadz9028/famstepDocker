import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const userId = session.user.id;

  try {
    await connectDb();

    if (req.method === "POST") {
      const {
        designation = "",
        userHobbies = [],
        userSkills = [],
        locationUser = "",
      } = req?.body?.values || {};

      // Map the skills array to an array of objects if userSkills is provided
      const formattedSkills = userSkills?.map((skill) => ({
        skill,
        rank: 0,
        points: 0,
        achievements: 0,
      }));

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          designation: designation,
          Interests: userHobbies,
          skills: formattedSkills || [],
          location: locationUser,
          isNewUser: false,
          verifiedTick: { color: "" },
          badges: {
            admin: { color: "", points: 0 },
            knowledge: { color: "", points: 0 },
            judgment: { color: "", points: 0 },
            leader: { color: "", points: 0 },
          },
          userFeedback:true
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User information updated successfully." });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

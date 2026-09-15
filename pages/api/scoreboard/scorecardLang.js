import User from "../../../model/userModel";
import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { selectedLang } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    // Fetch users with the selected skill and non-zero points
    const users = await User.find({
      skills: {
        $elemMatch: {
          skill: selectedLang,
          points: { $ne: 0 }, // Ensure points are not zero
        },
      },
    })
      .skip(skip)
      .limit(limit)
      .lean()
      .select({
        name: 1,
        image: 1,
        background: 1,
        achievements: 1,
        level: 1,
        skills: { $elemMatch: { skill: selectedLang } }, // Select the entire skills array
      });
    // Sort users based on the points of the selected language skill
    const sortedUsers = users.sort((a, b) => {
      const skillA = a.skills.find(skill => skill.skill === selectedLang)?.rank || 0;
      const skillB = b.skills.find(skill => skill.skill === selectedLang)?.rank || 0;

      return skillA - skillB; // Sort in descending order by points
    });

    return res.status(200).json({
      success: true,
      data: sortedUsers
    });
  } catch (error) {
    console.error("Error in fetching user data:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

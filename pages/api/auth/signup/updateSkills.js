import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  try {
    await connectDb();

    if (req.method === "PUT") {
      const { selectedLanguage } = req.body;

      if (!selectedLanguage || !Array.isArray(selectedLanguage)) {
        return res.status(400).json({ error: "Selected language is required and must be an array" });
      }

      // Fetch the current user data
      const user = await User.findById(userId).lean();
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if any of the selected languages already exist
      const existingSkills = new Set(user.skills.map(skill => skill.skill));
      const duplicateSkills = selectedLanguage.filter(skill => existingSkills.has(skill));

      if (duplicateSkills.length > 0) {
        return res.status(400).json({ error: `${duplicateSkills.join(', ')} is already available in your list.` });
      }

      // Merge new skills with existing ones, avoiding duplicates
      const newSkills = selectedLanguage.filter(skill => !existingSkills.has(skill));
      const newSkillsObjects = newSkills.map(skill => ({
        skill,
        rank: 0,
        points: 0,
        achievements: 0,
      }));

      // Prepare the update object
      const updateFields = {
        $push: { skills: { $each: newSkillsObjects } },
      };

      // Check if updateProfile is true, and set it to false if it is
      if (user.updateProfile === true) {
        updateFields.$set = { updateProfile: false };
      }

      // Update user skills and optionally updateProfile field
      await User.updateOne({ _id: userId }, updateFields);

      return res.status(200).json({ message: "User information updated successfully." });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

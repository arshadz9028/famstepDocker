import { getSession } from "next-auth/react";
import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";

const handler = async (req, res) => {
  try {
    await connectDb();

    if (req.method === "PUT") {
      const { name, username, designation, location, userBio } = req.body;

      // Validation
      if (!name.trim() || !/^[a-zA-Z'-]+(\s[a-zA-Z'-]+){1,2}$/i.test(name)) {
        return res.status(402).json({ error: "Please enter your first and last names" });
      } else if (!/^(?!.*\.$)(?!.*\.{2})(?=.*[a-zA-Z])[a-zA-Z0-9_][a-zA-Z0-9_.]{1,28}[a-zA-Z0-9_]$/i.test(username)) {
        return res.status(402).json({ error: "Please enter a valid username." });
      } else if (userBio && userBio.length > 145) {
        return res.status(402).json({ error: "Content should be 145 characters or fewer." });
      } else if (designation && !designation.trim()) {
        return res.status(402).json({ error: "Please enter your designation" });
      } else if (location && !location.trim()) {
        return res.status(402).json({ error: "Please enter your location" });
      }

      const session = await getSession({ req });

      if (!session) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { id: userId } = session.user;

      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      // Prepare the fields to be updated
      const updateFields = {
        ...name && { name },
        ...username && { username },
        ...designation && { designation },
        ...location && { location },
        ...userBio || userBio === "" ? { userBio } : {},
      };

      // Set `updateProfile` to false if it is currently true
      if (user.updateProfile === true) {
        updateFields.updateProfile = false;
      }

      // Update the user with the new fields
      const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
        new: true,
      });

      return res.status(200).json({ success: true, data: "Profile updated successfully!" }); // Respond with updated user data
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export default handler;

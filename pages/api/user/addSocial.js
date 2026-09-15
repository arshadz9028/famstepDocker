import connectDb from "../../../database/conn";
import AboutUser from "../../../model/aboutUser";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "POST") {
      const userId = session.user.id;
      const { twitter, linkdIn, facebook, github, Instagram } = req.body;

      // Create a new object to hold the social data
      const socialData = {
        twitter,
        linkdIn,
        facebook,
        github,
        Instagram,
      };

      // Use findOneAndUpdate to update the user or create a new one if not found
      const updatedUser = await AboutUser.findOneAndUpdate(
        { user: userId },
        { social: socialData }, // Set the social field to the new object
        {
          upsert: true,
          new: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "User Experience updated",
        user: updatedUser,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

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

    // Extract and parse pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    // Fetch users sorted by rank and paginated
    const users = await User.find({})
      .sort({ rank: 1 }) // Sort users by rank in ascending order
      .skip(skip)
      .limit(limit)
      .select("name image background achievements level points rank"); // Select necessary fields

    // Respond with the user data
    return res.status(200).json({
      success: true,
      data: users,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error in fetching user data:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

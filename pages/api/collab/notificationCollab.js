import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import User from "../../../model/userModel";

export default async function handler(req, res) {
  try {
    // Connect to the database
    await connectDb();

    // Validate session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Fetch user's collab posts and populate relevant fields
    const posts = await Collab.find({ userid: session.user.id })
      .populate("userid", "name username image");

    // If no posts found, return an empty response
    if (!posts.length) {
      return res.status(200).json({ success: true, message: "No posts found", data: [] });
    }

    // Update the notification field for all collabRequests
    const bulkOperations = posts.map(post => ({
      updateOne: {
        filter: { _id: post._id },
        update: { $set: { "collabRequests.$[].notification": false } },
      },
    }));

    // Execute bulk update
    if (bulkOperations.length) {
      await Collab.bulkWrite(bulkOperations);
    }

    res.status(200).json({ success: true, message: "Notifications updated successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

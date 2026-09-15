import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import User from "../../../model/userModel";

export default async function handler(req, res) {
  try {
    // Connect to the database
    await connectDb();

    // Get the session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Fetch posts where userid matches the session user id
    let postData = await Collab.find({ userid: session.user.id })
    .populate(
      "userid",
      "name username image"
    );
    postData = await User.populate(postData, [
      { path: "collabRequests.userid", select: "name username image" },
    ]);
    // Extract collabRequests from each post
    let formattedData = postData.map((post) => ({
      collabRequests: post.collabRequests,
      roles:post.roles,
      duration:post.durationReq,
      id:post._id,
      title:post.title
    }));

    return res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import User from "../../../model/userModel";

export default async function handler(req, res) {
  try {
    // Connect to the database
    await connectDb();
    const {projectTask} = req.query
    // Get the session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Fetch posts where userid matches the session user id
    let postData = await Collab.findOne({ _id: projectTask })
      .populate("userid", "name username image");

    // Populate additional nested fields
    postData = await User.populate(postData, [
      { 
        path: "collabRequests.userid", 
        select: "name designation image" 
      },
      { 
        path: "likes.user", 
        select: "name username image" 
      },
      { 
        path: "tag.userid", 
        select: "name username" 
      },
      { 
        path: "collabRequests.tasks.comments.commentUser", 
        select: "name image" 
      }
    ]);
    

    // Return the data
    return res.status(200).json({ success: true, data: postData });
  } catch (error) {
    console.error("Server error:", error.message);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

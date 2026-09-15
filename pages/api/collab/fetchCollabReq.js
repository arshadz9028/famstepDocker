import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";

import User from "../../../model/userModel";
export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    let postData = await Collab.find({userid:session.user.id})
    //   .populate("userid", "name username image")
   
    // postData = await User.populate(postData, [
    //   { path: "collabRequests.userid", select: "name designation image" },
    //   { path: "likes.user", select: "name username image" },
    //   { path: "tag.userid", select: "name username" },
    // ]);
    res.status(200).json({ success: true, data: postData });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

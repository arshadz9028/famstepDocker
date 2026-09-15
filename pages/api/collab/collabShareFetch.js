import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";

import User from "../../../model/userModel";
export default async function handler(req, res) {
  try {
    await connectDb();
   
    const {profile} = req.query;
    const collab = await Collab.findById(profile)
      .populate("userid", "name username image")
      .populate("collabRequests.userid", "name username image")
      .lean();
    res.status(200).json({ success: true, data: collab });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

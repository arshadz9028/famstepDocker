import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import Collab from "../../../model/collab";
import User from "../../../model/userModel";

export default async function handler(req, res) {
  try {
    // Connect to the database
    await connectDb();

    // Get the user session
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const userId = session.user.id;

    // Fetch collaboration data
    const collabData = await Collab.find();

    // Filter collaboration requests by the current user ID and include durationReq from parent collab
    let filteredRequests = collabData
      .flatMap((collab) => {
        return collab.collabRequests.map(request => {
          if (request.userid === userId) {
            return {
              ...request.toObject(),
              durationReq: collab.durationReq
            };
          }
          return null;
        }).filter(Boolean); // Remove null entries
      });

    // Populate user details for the filtered requests
    filteredRequests = await User.populate(filteredRequests, [
      { path: "owner", select: "name username image" },
      { path: "userid", select: "name username image designation" }
    ]);
    
    return res.status(200).json({ success: true, data: filteredRequests });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

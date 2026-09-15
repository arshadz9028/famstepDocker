import User from "../../../../model/userModel";
import connectDb from "../../../../database/conn";
import { getSession } from "next-auth/react";
import follow from "../../../../model/followModel";
import Famstep from "../../../../model/famstepOfficial";
export default async function handler(req, res) {
  const session = await getSession({ req });
 const {selectedLang} = req.query
 await connectDb();
  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const userId = '67f7c821696aed22412e4b06'
  
  try {
    // let user = await User.findOne({ _id: userId });
    let followersData = await follow.findOne({ user: userId });
    if (followersData) {
      
      followersData = await User.populate(followersData, [
        {
          path: "user",
          select: "",
        },
        {
          path: "followers.userid following.userid praise.userid",
          select: "name username image designation",
        },
      ]);
    }
    const announcement = await Famstep.find({}).sort({ createdAt: -1 });
        const sessionUser = await User.findById(userId)
    

  
   
    return res.status(200).json({ success: true,userDataS:sessionUser,data: followersData , announcement:announcement});
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

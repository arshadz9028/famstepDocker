import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";
import CardDelete from "../../../model/deleteCards";
import AboutUser from "../../../model/aboutUser";

export default async function handler(req, res) {
  
  try {
    await connectDb();
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = session.user.id;
   const {profile} = req.query

   let userAbout
   if(profile){
     userAbout = await AboutUser.findOne({user:profile})
   }else{
     userAbout = await AboutUser.findOne({user:userId})
   }
    

    return res.status(200).json({ success: true, AboutData:userAbout, });
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, error: "Server error" });
}
}
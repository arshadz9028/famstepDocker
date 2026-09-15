import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import CardDelete from "../../../model/deleteCards";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  
  try {
    await connectDb();
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {id} = req.query;
    const userid = session.user.id;
    
    const userDetails = await CardDelete.findOne({ user: userid });
    if (!userDetails) {
        await CardDelete.create({
            user: userid,
            deletedCards: [{ userId: id }],
          
        });
    } else {
        // If the user details are found, add a new blocked user entry
        userDetails.deletedCards.push({ userId: id });
        await userDetails.save();
    }
    return res.status(200).json({ success: true });
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, error: "Server error" });
}
}
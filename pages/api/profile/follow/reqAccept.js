import connectDb from "../../../../database/conn";
import frequest from "../../../../model/frequestModel";
import userModel from "../../../../model/userModel";
import { getSession } from "next-auth/react";

const reqAccept = async (req, res) => {
  if (req.method == 'POST') {
    try {
      await connectDb();
      const session = await getSession({ req });
      const userId = session?.user.id;
      const { followusername } = req.body;
      if (!followusername) {
        return res.status(400).json({ error: "Missing parameter: followusername" });
      }
      
      // Use findByIdAndUpdate to update the document
      const mineFollow = await frequest.findOne({ user: userId });
      mineFollow.followRequests.forEach((follow) => {
        if(follow.userid == followusername){

          follow.IsAccepted = true;
        }
      });
      await mineFollow.save(); 

     
      // Send a response with the updated document
      return res.status(200).json({ message: "Request accepted", mineFollow });
       
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    // Handle unsupported HTTP methods
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default reqAccept;

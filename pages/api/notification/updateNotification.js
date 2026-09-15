import connectDb from "../../../database/conn";
import frequest from "../../../model/frequestModel";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";

const updateNotification = async (req, res) => {
  if (req.method === "POST") {
    try {
      await connectDb();
      const session = await getSession({ req });
      const currentUser = session?.user.username;
      const userId = session?.user.id;
      // Update the notification field to false for the current user's requests
      const mineFollow = await frequest.findOne({ user: userId });
      if(mineFollow){

        mineFollow?.followRequests.forEach((follow) => {
          follow.notification = false;
        });
        await mineFollow.save(); 
      }
      return res.status(200).json({ message: "Notifications updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }else if(req.method === 'PUT'){
    try {
      await connectDb();
      const session = await getSession({ req });
      const userId = session?.user.id;
      // Update the notification field to false for the current user's requests
      let user = await User.findById(userId)
      user.contestNotification = false 
      await User.findByIdAndUpdate(userId,user)
      return res.status(200).json({ message: "Notifications updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default updateNotification;

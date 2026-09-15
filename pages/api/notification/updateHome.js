import connectDb from "../../../database/conn";
import followModel from "../../../model/followModel";
import { getSession } from "next-auth/react";
const updateHome = async (req, res) => {
  if (req.method === "POST") {
    try {
      await connectDb();
      const session = await getSession({ req });
      const username = session.user.id;

      // Assuming `Post` is the appropriate model for the user's requests, change it if needed
      const mineFollow = await followModel.findOne({user: username });
      if (!mineFollow) {
        return res.status(404).json({ error: "User's follow not found" });
      }
      // await followModel.updateMany({ "following.username": username }, { $set: { "followers.$.postNotification": false } });

      mineFollow.following.forEach((follow) => {
        follow.postNotification = false;
      });
      await mineFollow.save();

      // Update the notification field to false for all posts

      return res.status(200).json({ message: "Notifications updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};



export default updateHome;

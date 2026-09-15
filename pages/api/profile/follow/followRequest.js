import connectDb from "../../../../database/conn";
import frequest from "../../../../model/frequestModel";
import User from "../../../../model/userModel";
import { getSession } from "next-auth/react";
import follow from "../../../../model/followModel";

const followRequest = async (req, res) => {
  if (req.method === 'POST') {


    try {
      await connectDb();
      const session = await getSession({ req });
      const currentUser = session?.user.username;
      const userId = session?.user.id;

      const { followusername ,followStatus} = req.body;
      if (!followusername) {
        return res
          .status(400)
          .json({ error: "Missing parameter: followusername" });
      }

      /* find user */
    
      const mineFollow = await frequest.findOne({ user: userId });
      const userFollow = await frequest.findOne({ user: followusername });

      const updateUserFollow = async (user, followers) => {
        if (!user.followRequests.some((fll) => fll.userid == userId)) {
          user.followRequests.push({ userid: userId, notification: true,NetNotification:true, IsAccepted: false, followStatus });
          await user.save();
        } else {
          user.followRequests = user.followRequests.filter((ffl) => ffl.userid !== userId);
          await user.save();
        }

      };



      if (mineFollow && !userFollow) {
        const newUserObject = new frequest({
          user: followusername,
          followRequests: { userid: userId,followStatus },
        });
        await newUserObject.save();
      } else if (userFollow && !mineFollow) {
        const newUserObject = new frequest({
          user: userId,
          followRequests: [],
        });
        await newUserObject.save();
        await updateUserFollow(userFollow, "followRequests");
      } else if (mineFollow && userFollow) {
        await updateUserFollow(userFollow, "followRequests");
      } else {
        const newUserObject1 = new frequest({
          user: userId,
          followRequests: [],
        });
        await newUserObject1.save();
        const newUserObject2 = new frequest({
          user: followusername,
          followRequests: { userid: userId, notification: true,NetNotification:true, IsAccepted: false,followStatus },
        });
        await newUserObject2.save();
      }

      return res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  if (req.method === 'DELETE') {
    try {
      await connectDb();
      const session = await getSession({ req });
      const currentUser = session?.user.username;
      const userId = session?.user.id;
  
      const { userid } = req.query;
  
      if (!userid) {
        return res
          .status(400)
          .json({ error: "Missing parameter: userid" });
      }
  
      /* Delete the follow request from the current user's followRequests */
      const currentUserFollow = await frequest.findOne({ user: userId });
      currentUserFollow.followRequests = currentUserFollow.followRequests.filter(
        (ffl) => ffl.userid !== userid
      );
  
      await currentUserFollow.save();
  
      /* Delete the follow request from the target user's followRequests */
      const targetUserFollow = await frequest.findOne({ user: userid });
      targetUserFollow.followRequests = targetUserFollow.followRequests.filter(
        (ffl) => ffl.userid !== userId
      );
  
      await targetUserFollow.save();
  
      return res.status(200).json({ message: "Follow request deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
    
}
export default followRequest;

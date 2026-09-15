import connectDb from "../../../../database/conn";
import followModel from "../../../../model/followModel";
import userModel from "../../../../model/userModel";
import { getSession } from "next-auth/react";




const followDelete = async (req, res) => {

if (req.method === 'DELETE') {
    try {
      await connectDb();
      const session = await getSession({ req });
      const currentUser = session?.user.id;
  
      const { followusername } = req.query;
  
      if (!followusername) {
        return res
          .status(400)
          .json({ error: "Missing parameter: followusername" });
      }
  
      // Delete the follow request
      const userFollow = await followModel.findOne({ user: followusername });
  
      if (!userFollow) {
        return res.status(400).json({ error: "User follow data not found" });
      }
  
      userFollow.followers = userFollow.followers.filter((follower) => follower.userid !== currentUser);
      userFollow.following = userFollow.following.filter((follower) => follower.userid !== currentUser);
      await userFollow.save();
  
      const currentUserFollow = await followModel.findOne({ user: currentUser });
  
      if (currentUserFollow) {
        currentUserFollow.following = currentUserFollow.following.filter((following) => following.userid !== followusername);
        currentUserFollow.followers = currentUserFollow.followers.filter((following) => following.userid !== followusername);
        await currentUserFollow.save();
      }
  
      return res.status(200).json({ message: "Follow request deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
export default followDelete;

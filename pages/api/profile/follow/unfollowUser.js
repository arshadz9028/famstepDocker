import connectDb from "../../../../database/conn";
import followModel from "../../../../model/followModel";
import userModel from "../../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {

if (req.method === 'DELETE') {
    try {
      await connectDb();
      const session = await getSession({ req });
      const currentUser = session?.user.username;
      const userId = session?.user.id;
  
      const {toggleState, followusername } = req.query;
   
      if (!followusername) {
        return res
          .status(400)
          .json({ error: "Missing parameter: followusername" });
      }
      if(toggleState === 'Following' || toggleState === 'Members'){

      
      const userToUnfollow = await followModel.findOne({ user: followusername });
  
      if (!userToUnfollow) {
        return res.status(400).json({ error: "User follow data not found" });
      }
  
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (follower) => follower.userid !== userId
      );
  
      await userToUnfollow.save();
  
      const currentUserFollowing = await followModel.findOne({ user: userId });
  
      if (currentUserFollowing) {
        currentUserFollowing.following = currentUserFollowing.following.filter(
          (following) => following.userid !== followusername
        );
  
        await currentUserFollowing.save();
      }
  
      return res.status(200).json({ message: "Follow request deleted successfully" });
    }
    else if(toggleState === 'Followers'){


        const userToUnfollow = await followModel.findOne({ user: followusername });
  
        if (!userToUnfollow) {
          return res.status(400).json({ error: "User follow data not found" });
        }
    
        userToUnfollow.following = userToUnfollow.following.filter(
          (value) => value.userid !== userId
        );
    
        await userToUnfollow.save();
    
        const currentUserFollowing = await followModel.findOne({ user: userId });
    
        if (currentUserFollowing) {
          currentUserFollowing.followers = currentUserFollowing.followers.filter(
            (value) => value.userid !== followusername
          );
    
          await currentUserFollowing.save();
        }
    
        return res.status(200).json({ message: "Follow request deleted successfully" });
  
    }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
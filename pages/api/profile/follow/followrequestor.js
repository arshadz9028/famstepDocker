import connectDb from "../../../../database/conn";
import followModel from "../../../../model/followModel";
import userModel from "../../../../model/userModel";
import { getSession } from "next-auth/react";

const followUser = async (req, res) => {
  if (req.method == 'POST') {
    try {
      await connectDb();
      const session = await getSession({ req });
      const currentUser = session?.user.username;
      const userId = session?.user.id;
      const { followusername } = req.body;

      if (!followusername) {
        return res.status(400).json({ error: "Missing parameter: followusername" });
      }

      const userDetails = await userModel.findOne({ username: currentUser });
      const followersImage = userDetails.image;
      const mineFollow = await followModel.findOne({ user: userId });
      const userFollow = await followModel.findOne({ user: followusername });

      const updateMineFollow = async (user, followers) => {
        if (!user.followers.some((fll) => fll.userid === followusername)) {
          user.followers.push({ userid: followusername });
          await user.save();
        }
       
      };

      const updateUserFollow = async (user, following) => {
        if (!user.following.some((fllg) => fllg.userid === userId)) {
          user.following.push({ userid: userId, postNotification: false });
          await user.save();
        }
        
      };

      if (mineFollow && !userFollow) {
        const newUserObject = new followModel({
          user: followusername,
          followers: [],
          praise: [],
          groupsAdded: [],
          following: { userid: userId },
        });
        await newUserObject.save();
        await updateMineFollow(mineFollow, "following");
      } else if (userFollow && !mineFollow) {
        const newUserObject = new followModel({
          user: userId,
          followers: { userid: followusername },
          following: [],
          praise: [],
          groupsAdded: [],

        });
        await newUserObject.save();
        await updateUserFollow(userFollow, "followers");
      } else if (mineFollow && userFollow) {

        if (!mineFollow.followers.some((fll) => fll.userid === followusername)) {
          mineFollow.followers.push({ userid: followusername, });
          await mineFollow.save();
        }
        if (!userFollow.following.some((fll) => fll.userid === userId)) {
          userFollow.following.push({ userid: userId, postNotification: false });
          await userFollow.save();
        }

      } else {
        const newUserObject1 = new followModel({
          user: userId,
          followers: { userid: followusername },
          following: [],
          praise: [],
          groupsAdded: [],

        });
        await newUserObject1.save();
        const newUserObject2 = new followModel({
          user: followusername,
          followers: [],
          praise: [],
          groupsAdded: [],

          following: { userid: userId, postNotification: false },
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
  
      const { followusername } = req.query;
  
      if (!followusername) {
        return res
          .status(400)
          .json({ error: "Missing parameter: followusername" });
      }
  
      // Find the user to unfollow in the followModel
      const userToUnfollow = await followModel.findOne({ user: followusername });
  
      if (!userToUnfollow) {
        return res.status(400).json({ error: "User follow data not found" });
      }
  
      // Remove the current user from the followers of the target user
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (follower) => follower.userid !== userId
      );
  
      // Save the updated userToUnfollow document
      await userToUnfollow.save();
  
      // Remove the target user from the following of the current user
      const currentUserFollowing = await followModel.findOne({ user: userId });
  
      if (currentUserFollowing) {
        currentUserFollowing.following = currentUserFollowing.following.filter(
          (following) => following.userid !== followusername
        );
  
        // Save the updated currentUserFollowing document
        await currentUserFollowing.save();
      }
  
      return res.status(200).json({ message: "Follow request deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
}

export default followUser;

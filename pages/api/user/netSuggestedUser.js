import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";
import CardDelete from "../../../model/deleteCards";
import follow from "../../../model/followModel";

export default async function handler(req, res) {
  try {
    await connectDb();

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;    
    const skip = (page - 1) * limit;
    
    const userId = session.user.id;
    const userName = session.user.username;

    const filterDeleted = await CardDelete.findOne({ user: userId });
    const deletedUserIds = filterDeleted?.deletedCards?.map(card => card.userId) || [];

    const reqAccepted = await follow.findOne({ user: userId });
    const userFollowingIds = reqAccepted?.following?.map(follow => follow.userid) || [];

    const deletedUsernames = await User.find({ _id: { $in: deletedUserIds } }).select('username').lean();
    const deletedUsernamesList = deletedUsernames.map(user => user.username);

    const sessionUser = await User.findById(userId).lean();


    const userDataFetched = await User.find({

      $and: [
        { username: { $ne: userName } }, // Exclude the current username
        { username: { $nin: deletedUsernamesList } },
        { skills: { $exists: true, $ne: [] } },  
        { Interests: { $exists: true, $ne: [] } },
        { designation: { $exists: true, $ne: '' } },
        { location: { $exists: true, $ne: '' } }, // Exclude usernames in deletedUsernamesList
        { _id: { $nin: userFollowingIds } } // Exclude users in the following list
      ]

    })
    .skip(skip)
    .limit(limit)
    .lean();
    const userSuggested = userDataFetched.filter((value, index) => {
      
      // const currentUserskills = userExist?.skills.map((val) => val.skill) || [];
      // const selectedUserskills = value?.skills?.map((val) => val.skill) || [];
      
      const locationMatch = value?.location === sessionUser?.location;
      return locationMatch;
    });
   
    // const userSuggested = userDataFetched.filter(user => {
    //   const sessionLocation = sessionUser?.location || '';
    //   const sessionLocationParts = sessionLocation?.split(/[ ,]+/);  // Split by space or comma
    
    //   // Create a regex pattern to match any part of the sessionUser location
    //   const locationRegex = new RegExp(sessionLocationParts.join('|'), 'i');  // Case-insensitive matching
    
    //   return locationRegex.test(user?.location);
    // });
    
    return res.status(200).json({
      success: true,
      data: userSuggested,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

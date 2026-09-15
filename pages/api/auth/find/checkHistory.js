import connectDb from "../../../../database/conn";
import SearchHistory from "../../../../model/searchHistoryModel"; 
import { getSession } from "next-auth/react";
import User from "../../../../model/userModel";
import AccountBlock from "../../../../model/blockModel";

export default async function handler(req, res) {
  try {
    await connectDb();

    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userid = session.user.id;
    
    // Use Promise.all to run the queries concurrently
    const [filterBlocked, userFound] = await Promise.all([
      AccountBlock.findOne({ user: userid }).lean(),  // Use .lean() to return plain JS objects
      SearchHistory.findOne({ user: userid }).lean()
    ]);
    
    const blockedUserIds = filterBlocked?.blockedIds.map((value) => value.userId) || [];
    
    const userIds = userFound?.histUser.map((value) => value.userId) || [];
    const timeStamps = userFound?.histUser.map((value) => value.currentDate) || [];


    if (userIds.length === 0) {
      return res.status(200).json({ message: [] });
    }

    const blockedUsernames = await User.find({ _id: { $in: blockedUserIds } }).select("_id").lean();
    const blockedUsernamesArray = blockedUsernames.map((user) => user._id);

    // Fetch the users who are in the search history but not blocked
    const SearchH = await User.find({
      _id: { $in: userIds, $nin: blockedUsernamesArray }
    })
    .select("name username image")
    .lean();
    
    // Create a map of userId to timeStamp for easy lookup
    const userIdToTimeStampMap = new Map();
    userFound.histUser.forEach((entry) => {
      userIdToTimeStampMap.set(entry.userId.toString(), entry.currentDate);
    });

    // Add the timestamp to each user in the search history
    const response = SearchH.map((user) => ({
      ...user,
      timeStamp: userIdToTimeStampMap.get(user._id.toString())
    }));

    return res.status(200).json({ message: response || [] });

  } catch (error) {
    console.error('Error in search handler:', error);
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}

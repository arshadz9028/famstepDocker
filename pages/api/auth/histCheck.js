import connectDb from "../../../database/conn";
import SearchHistory from "../../../model/searchHistoryModel"; // Import the search history model
import { getSession, useSession } from "next-auth/react";
import User from "../../../model/userModel";
import AccountBlock from "../../../model/blockedAccounts";

export default async function handler(req, res) {
    const session = await getSession({ req });
    try {
      await connectDb();
      // const user = session?.user.username;
      const userid = session?.user.id;
      const filterBlocked = await AccountBlock.findOne({
        user: userid,
      });
      const blockedUserIds = filterBlocked?.blockedIds.map(
        (value) => value.userId
      );
  
      // Find usernames of blocked users
      const blockedUsernames = await User.find({
        _id: { $in: blockedUserIds },
      }).select("name");
      const blockedUsernamesArray = blockedUsernames.map((user) => user.name);
      const userFound = await SearchHistory.findOne({ user: userid }).lean(); // Added .lean() for performance
  
      const userIds = userFound?.histUser.map((value) => value.userId);
  
      const SearchH = await User.find({
        _id: { $in: userIds, $nin: blockedUsernamesArray }, // Use $in for filtering
      })
        .select("name username image") // Select fields to populate
        .lean();
      // SearchH now contains the user data with the specified fields populated
  
      return res.status(200).json({ message: SearchH });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  
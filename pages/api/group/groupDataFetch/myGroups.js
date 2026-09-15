import User from "../../../../model/userModel";
import CreateGroup from "../../../../model/createGrpModel";
import connectDb from "../../../../database/conn";
import { getSession } from "next-auth/react";
import CardNetDelete from "../../../../model/deleteNetCards";

export default async function handler(req, res) {
  try {
    // Get session and check if the user is authenticated
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    // Connect to the database
    await connectDb();

    const userId = session.user.id;

    // Retrieve the IDs of deleted groups for the user
    const filterDeleted = await CardNetDelete.findOne({ user: userId });
    const deletedGroupIds = filterDeleted?.deleteNetCard.map((value) => value.groupId) || [];

    // Find groups that the user has not deleted
    let groupUser = await CreateGroup.find({
      _id: { $nin: deletedGroupIds }
    });

    // Populate group data with user details
    groupUser = await User.populate(groupUser, {
      path: "admin members.user",
      select: "name username image designation",
    });

    // Filter groups where the current user is a member
    const memberGroups = groupUser.filter(group =>
      group?.members?.some(member => member.user?._id.toString() === userId)
    );

    // Filter groups where the current user is an admin
    const adminGroups = groupUser.filter(
      group => group?.admin?._id.toString() === userId
    );

    // Merge memberGroups and adminGroups, removing duplicates
    const combinedGroups = [
      ...memberGroups,
      ...adminGroups.filter(adminGroup => !memberGroups.some(memberGroup => memberGroup?._id.equals(adminGroup?._id)))
    ];

    // Return the combined group information
    return res.status(200).json({ success: true, data: combinedGroups });
  } catch (error) {
    console.error("Error in group user retrieval:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

import User from "../../../../model/userModel";
import CreateGroup from "../../../../model/createGrpModel";
import connectDb from "../../../../database/conn";
import { getSession } from "next-auth/react";
import CardNetDelete from "../../../../model/deleteNetCards";

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    const { groups } = req.query;

    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    await connectDb();

    const userId = session.user.id;

    // Retrieve groups that have been deleted by the user
    const filterDeleted = await CardNetDelete.findOne({ user: userId });
    const deletedGroupIds = filterDeleted?.deleteNetCard.map((value) => value.groupId) || [];

    // Fetch groups that the user hasn't deleted
    let groupUser = await CreateGroup.find({ _id: { $nin: deletedGroupIds } });

    // Populate group data with admin and members' details
    groupUser = await User.populate(groupUser, {
      path: "admin members.user",
      select: "name username image designation",
    });

    // Filter out the specific group based on the query parameter
    const groupData = groupUser.find((group) => group._id.toString() === groups);


    return res.status(200).json({ success: true, data: groupData  });
  } catch (error) {
    console.error("Error in group user retrieval:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

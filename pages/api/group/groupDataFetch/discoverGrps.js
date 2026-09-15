import User from "../../../../model/userModel";
import CreateGroup from "../../../../model/createGrpModel";
import connectDb from "../../../../database/conn";
import { getSession } from "next-auth/react";
import CardNetDelete from "../../../../model/deleteNetCards";
import follow from "../../../../model/followModel";

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    await connectDb();

    const userId = session.user.id;

    const filterDeleted = await CardNetDelete.findOne({ user: userId });
    const deletedGroupIds =
      filterDeleted?.deleteNetCard.map((value) => value.groupId) || [];
    const deletedGrps = await CreateGroup.find({
      _id: { $in: deletedGroupIds },
    });

    let groupUser = await CreateGroup.find({
      _id: { $nin: deletedGrps.map((deletedGroup) => deletedGroup._id) },
    })
      .skip(skip)
      .limit(limit)
      .lean();

    groupUser = await User.populate(groupUser, {
      path: "admin members.user",
      select: "name username image designation",
    });
    return res.status(200).json({ success: true, data: groupUser });
  } catch (error) {
    console.error("Error in group user retrieval:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}

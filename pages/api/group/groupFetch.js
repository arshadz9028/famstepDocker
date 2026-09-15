import User from "../../../model/userModel";
import CreateGroup from "../../../model/createGrpModel";
import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import CardNetDelete from "../../../model/deleteNetCards";
import follow from "../../../model/followModel";

export default async function handler(req, res) {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    await connectDb();

    const userId = session.user.id;

    const filterDeleted = await CardNetDelete.findOne({ user: userId });
    const deletedGroupIds = filterDeleted?.deleteNetCard.map((value) => value.groupId) || [];
    const deletedGrps = await CreateGroup.find({ _id: { $in: deletedGroupIds } });
    
    let groupUser = await CreateGroup.find({ _id: { $nin: deletedGrps.map((deletedGroup) => deletedGroup._id) } });
    
    groupUser = await User.populate(groupUser, {
      path: "admin members.user",
      select: "name username image designation",
    });

    const filterGrp = await follow.findOne({ user: userId });
    const userGrp = filterGrp?.groupsAdded.map((value) => value.grpId);
    const GrpIds = await CreateGroup.find({ _id: { $in: userGrp } });
    let dataFetch = await CreateGroup.find({
      $and: [

        { _id: { $nin: GrpIds.map((addedGroup) => addedGroup._id) } },
        { _id: { $nin: deletedGrps.map((deletedGroup) => deletedGroup._id) } }
      ]

    });
    dataFetch = await User.populate(dataFetch, {
      path: "admin members.user",
      select: "name username image designation",
    });


    return res.status(200).json({ success: true, data: groupUser, dataGet: dataFetch });
  } catch (error) {
    console.error("Error in group user retrieval:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

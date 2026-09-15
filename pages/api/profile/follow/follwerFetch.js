import frequest from "../../../../model/frequestModel";
import follow from "../../../../model/followModel";
import User from "../../../../model/userModel";
import CreateGroup from "../../../../model/createGrpModel";
import connectDb from "../../../../database/conn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const userId = session.user.id

  await connectDb();
  // const {followusername}  = req.query;
  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  let followers = await frequest.findOne({ user: userId });

  followers = await User.populate(followers, [
    {
      path: "followRequests.userid",
      select: "name username image designation",
    },
    {
      path: "groupInvites.admin",
      select: "name username",
    },
  ]);

  followers = await CreateGroup.populate(followers, {
    path: "groupInvites.groupId",
    select: "groupName image"
  })
  let followersData = await follow.findOne({ user: userId });
  followersData = await User.populate(followersData, {
    path: "followers.userid following.userid praise.userid",
    select: "name username image designation",
  });
  followersData = await CreateGroup.populate(followersData, {
    path: "groupsAdded.grpId",
    select: "groupName image",
  })

  const allfollowers = await frequest.find({})
  // const allfollowers1 = await frequest.find({})

  return res.status(200).json({ success: true, data: followers, dats: followersData, alldat: allfollowers });


}

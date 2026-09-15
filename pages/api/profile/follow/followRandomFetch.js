import frequest from "../../../../model/frequestModel";
import follow from "../../../../model/followModel";
import User from "../../../../model/userModel";
import connectDb from "../../../../database/conn";

export default async function handler(req, res) {
  const {id} = req.query
 
  await connectDb();
 

  let followersData = await follow.findOne({ user: id })
  followersData = await User.populate(followersData, {
    path: "followers.userid following.userid praise.userid",
  select: "name username image designation",
  })
  const allfollowers = await frequest.findOne({user:id})


  return res.status(200).json({ success: true,  dats: followersData , alldat:allfollowers});


}

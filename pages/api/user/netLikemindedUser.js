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
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const userId = session.user.id;
    const userName = session.user.username;

    const filterDeleted = await CardDelete.findOne({ user: userId });
    const deletedUserIds = filterDeleted?.deletedCards?.map((value) => value.userId);

    const reqAccepted = await follow.findOne({ user: userId });
    const userFollowing = reqAccepted?.following?.map((value) => value.userid);

    const deletedUsernames = await User.find({ _id: { $in: deletedUserIds } });
    const followIds = await User.find({ _id: { $in: userFollowing } });

    

    /* filter suggested data */
    const sessionUser = await User.findById(userId)
    const userDataFetched = await User.find({
      $and: [
        { username: { $ne: userName } },
        { skills: { $exists: true, $ne: [] } },  
        { Interests: { $exists: true, $ne: [] } },
        { designation: { $exists: true, $ne: '' } },
        { location: { $exists: true, $ne: '' } },
        { username: { $nin: deletedUsernames?.map((deleteUser) => deleteUser.username) } },
        { _id: { $nin: followIds?.map((fflw) => fflw._id) } },
      ],
    })
    .skip(skip)
    .limit(limit)
    .lean();

   
    const userLikeMinded = userDataFetched
      .filter((value, index) => {
        //skills data collect krne k liye
        const otheruserSkills = value?.skills?.map(value => value.skill)?.join(', ').toLowerCase().split(' ') || []; 
        const sessionUserskill = sessionUser?.skills?.map((value)=> value.skill)?.join(', ').toLowerCase()
        const splitttedSkills = otheruserSkills.some(word =>sessionUserskill.includes(word) )

        //intrests data collect krne k liye
        const otheruserHobbies = (value.Interests)?.join(', ').toLowerCase().split(' ') || [];
        const sessionUserhobby = (sessionUser.Interests)?.join(', ').toLowerCase()
        const splitttedHobbies = otheruserHobbies.some(word =>sessionUserhobby.includes(word))

        //designation data collect krne k liye
        const splitUserDesignation = value?.designation?.toLowerCase()?.split() || [];
        const splitCurrentUserDesignation = sessionUser?.designation?.toLowerCase()?.split() || [];
        const desigMatch = splitUserDesignation.some(word => splitCurrentUserDesignation.includes(word));
       
        const indexIncluded = desigMatch || splitttedSkills || splitttedHobbies
       

        return indexIncluded
      })
    return res.status(200).json({
      success: true, data: userLikeMinded
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

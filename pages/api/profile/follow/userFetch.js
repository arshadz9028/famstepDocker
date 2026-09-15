import User from "../../../../model/userModel";
import connectDb from "../../../../database/conn";
import { getSession } from "next-auth/react";
import follow from "../../../../model/followModel";
export default async function handler(req, res) {
  const session = await getSession({ req });
 const {selectedLang} = req.query
 await connectDb();
  if (!session) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  const userId = session.user.id;
  
  try {
    // let user = await User.findOne({ _id: userId });
    let followersData = await follow.findOne({ user: userId });
    if (followersData) {
      followersData = await User.populate(followersData, [
        {
          path: "user",
          select: "",
        },
        {
          path: "followers.userid following.userid praise.userid",
          select: "name username image designation",
        },
      ]);
    }
    
    const sessionUser = await User.findById(userId)
    

    const userData = await User.find({});

    const sortedUserData = userData
    .slice() 
    .sort((a, b) => {
      return (b?.points || 0) - (a?.points || 0);
    })
    const sortedSkillData = userData
    .slice() 
    .sort((a, b) => {
      const filteredValA = a?.skills.find(val => val.skill == selectedLang);
     

      const filteredValB = b?.skills.find(val => val.skill == selectedLang);
     

      return (filteredValB?.points || 0) - (filteredValA?.points || 0);
    });
   
    return res.status(200).json({ success: true,userDataS:sessionUser, data: followersData, 
      overallData: sortedUserData, selectedData:sortedSkillData });
  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

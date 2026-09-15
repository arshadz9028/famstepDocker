import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";
import UserBlock from "../../../../model/blockModel";
import { getSession, useSession } from "next-auth/react";

const handler = async (req, res) => {
  const session = await getSession({ req });
  try {
    await connectDb();

    const {value} = req.body;
    const currentUser = session?.user.username;
    const filterBlocked = await UserBlock.findOne({ user: session?.user.id });
    const blockedUserIds = filterBlocked?.blockedIds.map(value => value.userId);
    const blockedUsernames = await User.find({ _id: { $in: blockedUserIds } });
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: `${value}`, $options: "i" } },
            { name: { $regex: `${value}`, $options: "i" } },
          ],
        },
        { username: { $ne: currentUser } }, 
        { username: { $nin: blockedUsernames.map(blockedUser => blockedUser.username) } }, 
      ],
    }).select("name username image")
    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
export default handler;

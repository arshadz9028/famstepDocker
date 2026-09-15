import connectDb from "../../../../database/conn";
import AccountBlock from "../../../../model/blockedAccounts";
import UserBlock from "../../../../model/blockModel";
import User from "../../../../model/userModel";

import { getSession } from "next-auth/react";
import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    const userId = session?.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    let findUser = await UserBlock.findOne({ user: userId });
    findUser = await User.populate(findUser,{
        path:'blockedIds.userId',
        select: "name username image",
    })
    return res.status(200).json({ res: findUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

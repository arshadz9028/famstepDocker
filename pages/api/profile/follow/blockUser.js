import connectDb from "../../../../database/conn";
import AccountBlock from "../../../../model/blockedAccounts";
import UserBlock from "../../../../model/blockModel";

import { getSession } from "next-auth/react";

const blockUser = async (req, res) => {
  try {
    await connectDb();
    const session = await getSession({ req });
    const userId = session?.user.id;
    const { message } = req.query;

    if (req.method === "POST") {
      // Block the user

      const userDetails = await UserBlock.findOne({ user: userId });

      if (!userDetails) {
        // If the user details are not found, create a new UserBlock entry
        await UserBlock.create({
          user: userId,
          blockedIds: [{ userId: message }],
        });
      } else {
        // If the user details are found, add a new blocked user entry
        userDetails.blockedIds.push({ userId: message });
        await userDetails.save();
      }

    //   const usersAcc = await AccountBlock.findOne({
    //     user: userId,
    //   });

    //   if (!usersAcc) {
    //     await AccountBlock.create({
    //       user: userId,
    //       blockedIds: [{ userId: message }],
    //     });
    //   } else {
    //     // If the user details are found, add a new blocked user entry
    //     usersAcc.blockedIds.push({ userId: message });
    //     await usersAcc.save();
    //   }

    //   const messageUsersAcc = await AccountBlock.findOne({
    //     user: message,
    //   });
    //   if (!messageUsersAcc) {
    //     await AccountBlock.create({
    //       user: message,
    //       blockedIds: [{ userId }],
    //     });
    //   } else {
    //     // If the user details are found, add a new blocked user entry
    //     messageUsersAcc.blockedIds.push({ userId });
    //     await messageUsersAcc.save();
    //   }

      return res.status(200).json({ message: "User blocked successfully" , res:userDetails});
    } else if (req.method === "DELETE") {
      // Unblock the user

      // Remove the blocked user from the user's blocked list
      await UserBlock.updateOne(
        { user: userId },
        { $pull: { blockedIds: { userId: message } } }
      );

    //   await AccountBlock.updateOne(
    //     { user: userId },
    //     { $pull: { blockedIds: { userId: message } } }
    //   );

    //   await AccountBlock.updateOne(
    //     { user: message },
    //     { $pull: { blockedIds: { userId } } }
    //   );

      return res.status(200).json({ message: "User unblocked successfully" });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default blockUser;

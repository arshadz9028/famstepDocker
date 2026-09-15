import connectDb from "../../../database/conn";
import UserBlock from "../../../model/blockModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });
    const {message} = req.query
    if (!session) {
      return res.status(400).json({ success: false, message: "Access denied" });
    }
    const blockedUser = await UserBlock.findOne({ user: message });
    const blockedUser2 = await UserBlock.findOne({ user: session?.user?.id });

    return res.status(200).json({ success: true, blockedUser,blockedUser2});
  } catch (error) {
    console.error(error);
  }
}

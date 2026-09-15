import connectDb from "../../../../database/conn";
import SearchHistory from "../../../../model/searchHistoryModel";
import { getSession } from "next-auth/react";
import mongoose from "mongoose";

const handler = async (req, res) => {
  try {
    await connectDb();

    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = session.user.id;
    const { id } = req.query;

    const userFound = await SearchHistory.findOne({ user: userId });

    if (!userFound) {
      return res.status(404).json({ error: "Search history item not found" });
    }
    /* id ki type change krna h because its in Object form in database */
    const userIdToRemove = mongoose.Types.ObjectId(id);

    await SearchHistory.updateOne(
      { user: userId },
      { $pull: { histUser: { userId: userIdToRemove } } }
    );

    return res.status(200).json({ message: "Search history item deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;

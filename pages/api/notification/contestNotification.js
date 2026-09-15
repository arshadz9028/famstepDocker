import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import Competition from "../../../model/competition";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      await connectDb();
      const session = await getSession({ req });
      const userid = session.user.id;
      const codeData = await Competition.find({});
      const users = await User.find({});
      const io = req.socket.server.io;
      for (const user of users) {
        const levelNotification = codeData?.some(
          (value) => value.stage == user.level + 1
        );

        if (levelNotification) {
          await User.updateOne(
            { _id: user._id },
            { $set: { contestNotification: true } }
          );
        }
      }
      const notifiUpdate = await User.findById(userid)
      io.emit("notifiUpdate",notifiUpdate.contestNotification)
      return res
        .status(200)
        .json({ message: "Notifications updated successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "POST") {
    try {
      await connectDb();
      const session = await getSession({ req });
      const { constId } = req.body;
      const userId = session.user.id;
      
      const competition = await Competition.findById(constId);
      if (!competition) {
        return res.status(404).json({ error: "Competition not found" });
      }
      
      const participant = competition.participants.find(
        (participant) => participant.user == userId
      );
      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }
      
      participant.isNotified = false;
  
      await competition.save();
      
      return res.status(200).json({ message: "Notification status updated" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

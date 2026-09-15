import connectDb from "../../../database/conn";
import frequest from "../../../model/frequestModel";
import { getSession } from "next-auth/react";

const inviteRequest = async (req, res) => {
  if (req.method === 'POST') {
    try {
      await connectDb();
      const session = await getSession({ req });

      const { finalUser, inviteStatus, groups } = req.body;

      if (!finalUser || !groups) {
        return res.status(400).json({ error: "Missing parameters: finalUser or groups" });
      }

      for (const followusername of finalUser) {
        let existingUser = await frequest.findOne({ user: followusername });

        if (!existingUser) {
          const newInvitation = new frequest({
            user: followusername,
            followRequests:[],
            groupInvites: {
              admin:session.user.id,
              grpNotification: true,
              IsAcctdInvite: false,
              groupId: groups,
              inviteStatus
            }
          });
          await newInvitation.save();
        } else {
          existingUser.groupInvites.push({
            admin:session.user.id,
            grpNotification: true,
            IsAcctdInvite: false,
            groupId: groups,
            inviteStatus
          });

          await existingUser.save();
        }
      }

      return res.status(200).json({ message: "Users processed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

export default inviteRequest;

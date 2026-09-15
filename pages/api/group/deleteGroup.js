import connectDb from "../../../database/conn";
import frequest from "../../../model/frequestModel";
import followModel from "../../../model/followModel";
import createGroup from "../../../model/createGrpModel";
import Post from "../../../model/postModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        const session = await getSession({ req });
        const userId = session.user.id;
        const { groups } = req.query;

        if (!groups) {
            return res.status(400).json({ error: "Missing parameters: groups" });
        }

        try {
            await connectDb();

            
            await createGroup.findByIdAndDelete(groups);

           
            await frequest.updateMany(
                { "groupInvites.groupId": groups },
                { $pull: { groupInvites: { groupId: groups } } }
            );

          
            await followModel.updateMany(
                { "groupsAdded.grpId": groups },
                { $pull: { groupsAdded: { grpId: groups } } }
            );

          
            await Post.deleteMany({ groupId: groups });

            return res.status(200).json({ message: "Group left successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}

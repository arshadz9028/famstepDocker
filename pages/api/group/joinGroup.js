import followModel from "../../../model/followModel";
import CreateGroup from "../../../model/createGrpModel";
import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import frequest from "../../../model/frequestModel";

export default async function handler(req, res) {
    if (req.method === 'PUT') {
        const session = await getSession({ req });
        const userId = session.user.id;
        const { grpId } = req.body;
        if (!grpId ) {
            return res.status(400).json({ error: "Missing parameters: grpId or admin" });
        }
        try {
            await connectDb();
            const findGrp = await CreateGroup.findOne({ _id: grpId });

            if (!findGrp) {
                return res.status(404).json({ error: "Group not found" });
            }

            if (!findGrp.members.some((value) => value.user == userId)) {
                findGrp.members.push({ user: userId });
            }

            await findGrp.save();
            try {
                const grpFollow = await followModel.findOne({ user: userId });

                if (!grpFollow) {
                    const newGrp = new followModel({
                        user: userId,
                        groupsAdded: [
                            {
                                grpId,
                               
                            }
                        ],
                        followers: [],
                        following: [],
                        praise: []
                    });

                    await newGrp.save();
                } else {
                    if (!grpFollow.groupsAdded.some((value) => value.grpId == grpId)) {
                        grpFollow.groupsAdded.push({
                            grpId,
                           
                        });
                        await grpFollow.save();
                    }
                }
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
            }
           
            return res.status(200).json({ message: "User processed successfully" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
   
}

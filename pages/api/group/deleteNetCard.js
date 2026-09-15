import followModel from "../../../model/followModel";
import CreateGroup from "../../../model/createGrpModel";
import connectDb from "../../../database/conn";
import { getSession } from "next-auth/react";
import CardNetDelete from "../../../model/deleteNetCards";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const session = await getSession({ req });
        const userId = session.user.id;
        const { grpId } = req.query;
        if (!grpId ) {
            return res.status(400).json({ error: "Missing parameters: grpId or admin" });
        }    
        
        try {
            await connectDb();
            const userDetails = await CardNetDelete.findOne({ user: userId });
            if (!userDetails) {
                await CardNetDelete.create({
                    user: userId,
                    deletedCards: [],
                    deleteNetCard:[{ groupId: grpId }]
                });
            } else {
                // If the user details are found, add a new blocked user entry
               
                userDetails.deleteNetCard.push({  groupId: grpId });
                await userDetails.save();
            }
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
   
}

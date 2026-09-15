import connectDb from "../../../database/conn";
import frequest from "../../../model/frequestModel";
import { getSession } from "next-auth/react";
export default async function handler(req, res) {

    if (req.method === 'POST') {
        const session = await getSession({ req });
        const userId = session.user.id;
        const { grpId } = req.body;
        if (!grpId) {
            return res.status(400).json({ error: "Missing parameters: grpId or admin" });
        }
        try {
            await connectDb();
            const mineGroup = await frequest.findOne({ user: userId });
            mineGroup.groupInvites.forEach((value) => {
              if(value.groupId == grpId){
      
                value.IsAcctdInvite = true;
              }
            });
            await mineGroup.save(); 
      
           
            // Send a response with the updated document
            return res.status(200).json({ message: "Request accepted", mineGroup });
             
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
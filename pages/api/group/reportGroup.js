import connectDb from "../../../database/conn";
import GroupReport from "../../../model/groupReport";

import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    try {
        await connectDb();
        const session = await getSession({ req });
        const userId = session?.user.id;
        const { message } = req.query;
        const { reason } = req.body; 
        
        if (req.method === "POST") {
            const userDetails = await GroupReport.findOne({ ReportUser: message });
            if (!userDetails) {
                await GroupReport.create({
                    ReportGroup: message,
                    Report: [{ victimUser: userId, reason }],
                });
            } else {
                userDetails.Report.push({ victimUser: userId, reason });
                await userDetails.save();
            }
            return res.status(200).json({ message: "User reported successfully" });
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};



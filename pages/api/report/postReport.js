import connectDb from "../../../database/conn";
import UserReport from "../../../model/reportModel";

import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    try {
        await connectDb();
        const session = await getSession({ req });
        const sessionUser = session?.user.id;
        const {message, reason ,userId} = req.body; // Assuming the report reason is sent as "reason" in the request body
        if (req.method === "POST") {
            const userDetails = await UserReport.findOne({ ReportUser: userId });
            if (!userDetails) {
                await UserReport.create({
                    ReportUser: userId,
                    profileReport:[],
                    PostReport: [{ victimUser: sessionUser, reason,PostId:message, }],
                });
            } else {
                // If the user details are found, add a new report entry
                userDetails.PostReport.push({ victimUser: sessionUser, reason,PostId:message });
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



import connectDb from "../../../database/conn";
import Competition from "../../../model/competition";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectDb();
        const session = await getSession({ req });

        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId = session.user.id;

        // Get user data to determine their level
        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        // Get competition data for the user's level
        const userLevel = userData.level + 1;
        const competitionData = await Competition.find({ stage: userLevel.toString() })
            .populate({
                path: "participants.user",
                select: "name username image"
            });

        // Get submission data if it exists
        const subData = competitionData[0] || null;
        const rankData = competitionData.filter(comp => comp.contestState === "previous") || [];

        return res.status(200).json({
            success: true,
            subData,
            rankData,
            userData
        });

    } catch (error) {
        console.error("Error in codeLevel API:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
} 
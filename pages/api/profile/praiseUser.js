import connectDb from "../../../database/conn";
import followModel from "../../../model/followModel";
import userModel from "../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            await connectDb();
            const session = await getSession({ req });

            const userId = session?.user.id;
            const { profile } = req.query;

            if (!profile) {
                return res.status(400).json({ error: "Missing parameter: profile" });
            }

            let userPraise = await followModel.findOne({ user: profile });

            if (!userPraise) {
                const newPraise = new followModel({
                    user: profile,
                    followers: [],
                    praise: { userid: userId },
                    following: [],
                });
                await newPraise.save();
            } else {
                if (!userPraise.praise.some((fll) => fll.userid == userId)) {
                    userPraise.praise.push({ userid: userId });
                    await userPraise.save();
                } else {
                    userPraise.praise = userPraise.praise.filter((value) => value.userid !== userId);
                    await userPraise.save();
                }
            }

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}

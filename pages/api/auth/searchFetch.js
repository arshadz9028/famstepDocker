import connectDb from "../../../database/conn";
import User from "../../../model/userModel";

import { getSession, useSession } from "next-auth/react";


const handler = async (req, res) => {

    const session = await getSession({ req });
    try {
        await connectDb();

        const {value} = req.body;
        const currentUser = session?.user.username;
        const search = value.trim()
        if (search === '') {
            return res.status(404).json({ error: "User not found" });

        }
        const user = await User.find({
            $and: [
                {
                    $or: [
                        { username: { $regex: `${search}`, $options: "i" } },
                        { name: { $regex: `${search}`, $options: "i" } },
                    ],
                },
                { username: { $ne: currentUser } }, // exclude the currently logged-in user
            ],
        });
        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ message: user });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
export default handler;

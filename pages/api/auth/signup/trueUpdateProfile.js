import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    try {
        const session = await getSession({ req });
        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const userId = session.user.id;
        await connectDb();

        if (req.method === "PUT") {
            // Find the user by ID
            const user = await User.findById(userId);

            // Check if user exists and if both `designation` and `skills` are empty
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            if ((!user.designation || user.designation.trim() === "") ||
                (!user.skills || user.skills.length === 0)) {

                // Update the `updateProfile` field to false if conditions are met
                await User.findByIdAndUpdate(
                    userId,
                    {
                        updateProfile: true,
                    },
                    { new: true }
                );
            }

            return res.status(200).json({ message: "User information updated successfully." });
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

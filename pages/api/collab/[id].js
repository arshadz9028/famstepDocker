import connectDb from "../../../database/conn";
import Collab from "../../../model/collab";

export default async function handler(req, res) {
    await connectDb();

    const { id } = req.query;
    if (req.method === "GET") {
        try {
            // Find the collaboration by ID and populate the user data
            const collabData = await Collab.findById(id)
                .populate({
                    path: "userid",
                    select: "name image username _id",
                })
                .populate({
                    path: "collabRequests.userid",
                    select: "name image username _id",
                });

            if (!collabData) {
                return res.status(404).json({ error: "Collaboration not found" });
            }
            return res.status(200).json(collabData);
        } catch (error) {
            console.error("Error fetching collaboration data:", error);
            return res.status(500).json({ error: "Server error" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
} 
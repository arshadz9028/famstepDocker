import connectDb from "../../../database/conn";
import Chat from "../../../model/chatModel"; // Import the Chat model
import { getSession } from "next-auth/react";
import MessageChat from "../../../model/messageModel";

export default async function handler(req, res) {
    try {
        await connectDb();
        const session = await getSession({ req });

        // Find chat data for the user, with user population and sorting
        let userMsgData = await Chat.find({
            "chatLength.recieverUser": session.user.id,
            "chatLength.counterMessage": { $gt: 0 },
        })
            .populate("users")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        // Populate the 'latestMessage.sender' path with specific fields

        await Chat.populate(userMsgData, {
            path: "latestMessage.sender",
            select: "name pic email",
        });

     
        return res.status(200).json({ success: true, data: userMsgData });
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ success: false, error: "An error occurred." });
    }
}

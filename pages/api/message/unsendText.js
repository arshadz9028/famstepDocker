import connectDb from "../../../database/conn";
import Message from '../../../model/messageModel';

export default async function handler(req, res) {
  try {
    await connectDb();

    if (req.method === 'DELETE') {
      // Handle DELETE request to delete a message
      const { messageId } = req.query;

      const message = await Message.findByIdAndDelete(messageId);

      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }

      // Emit a Socket.IO event to inform clients about the deleted message
      const io = req.socket.server.io;
      if (io) {
        io.emit("message unsent", messageId);

      }

      res.json({ message: "Message deleted successfully" });
    }
    
  } catch (error) {
    console.error("Error handling delete request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

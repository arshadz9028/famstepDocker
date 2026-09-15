import { Server } from "socket.io";
import connectDb from "../../../database/conn";
import Messages from "../../../model/chatModel";
import { getSession } from "next-auth/react";
import User from "../../../model/userModel";
import { createRouter, expressWrapper } from "next-connect";

let io;
export default async function handler(req, res) {
  // Connect to MongoDB
  connectDb().catch((error) => res.json({ error: "connection failed...!" }));
  if (res.socket.server.io) {
    res.end();
    return;
  }

  io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {

    socket.on("setup", (userData) => {
      if (userData) {
        const userId = userData.id; // Get the user's unique ID
        socket.join(userId); // Join a room based on user ID
        socket.emit("connected"); // Acknowledge connection
        // Listen for disconnect event for this specific user
        socket.on("disconnect", async () => {
          const session = await getSession()
          const timestamp = new Date().toISOString();
          if (!session) {
            // Fetch the user data from the database
            const user = await User.findById(userId).lean();

            // Check if the user exists and if both `designation` and `skills` are empty
            if ((!user.designation || user.designation.trim() === "") ||
              (!user.skills || user.skills.length === 0)) {
                await User.findByIdAndUpdate(
                  userId,
                  {
                    userActive: false,
                    lastSeen: timestamp,
                    // updateProfile: true, 
                  },
                  { new: true }
                );
            } else {
              // If the conditions are not met, just update the status and lastSeen
              await User.findByIdAndUpdate(
                userId,
                {
                  userActive: false,
                  lastSeen: timestamp,
                },
                { new: true }
              );
            }
          }
        });
      }
    });

    socket.on("join chat", (room) => {
      socket.join(room);
    });
    socket.on("joinLevelRoom", (room) => {
      socket.join(room);
    });

    socket.on("new message", (newMessageReceived) => {
      var chat = newMessageReceived.message.chat;

      if (!chat.users) {
        return console.log("chat.users not defined");
      }
      chat.users.forEach(async (user) => {
        if (user._id == newMessageReceived.message.sender._id) return;

        io.in(user._id).emit("messageRecieved", newMessageReceived);
      });
    });

    socket.on("changed page", () => {
      socket.emit("change the selectRef");
    });
  });
  res.end();
}

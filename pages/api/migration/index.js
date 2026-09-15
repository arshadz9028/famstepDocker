import connectDb from "../../../database/conn";
import UserModel from "../../../model/userModel";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });

    // Add `userFeedback` field with a default value to all users
    const result = await UserModel.updateMany(
      {}, // No filter to target all user documents
      { $set: { collabNotification: false } } // Add or update the `userFeedback` field
    );

    res.status(200).json({
      message: "Migration successful",
      updatedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error during migration:", error);
    res.status(500).json({ error: "Migration failed" });
  }
}

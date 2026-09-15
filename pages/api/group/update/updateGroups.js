import { getSession } from "next-auth/react";
import connectDb from "../../../../database/conn";
import CreateGroup from "../../../../model/createGrpModel";

const handler = async (req, res) => {
  try {
    await connectDb();

    if (req.method === "PUT") {
      const { name, desc,groupId } = req.body;
    
      const session = await getSession({ req });

      if (!session) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { id: userId } = session.user;

      // Find the user by ID
      const user = await CreateGroup.findById(groupId);

      if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
      }

      const updateFields = {};

      if (name) {
        updateFields.groupName = name;
      }

      if (desc) {
        updateFields.description = desc;
      }

     
      const updatedUser = await CreateGroup.findByIdAndUpdate(groupId, updateFields, { new: true });

      res.status(200).json({ success: true, data: updatedUser }); // Respond with updated user data
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export default handler;

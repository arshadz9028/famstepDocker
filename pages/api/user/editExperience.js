import connectDb from "../../../database/conn";
import AboutUser from "../../../model/aboutUser";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    await connectDb();
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "POST") {
      const userId = session.user.id;
      const {
        description,
        role,
        company,
        working,
        selectEndyear,
        selectJoinyear,
        selectEndmonths,
        selectJoinmonths,
      } = req.body;

      const updateData = {
        $push: {
          experience: {
            company,
            Role: role,
            joinMonth: selectJoinmonths,
            joinYear: selectJoinyear,
            endMonth: selectEndmonths,
            endYear: selectEndyear,
            description,
            working,
          },
        },
      };

      // Use findOneAndUpdate to update the user or create a new one if not found
      const updatedUser = await AboutUser.findOneAndUpdate(
        { user: userId },
        updateData,
        {
          upsert: true,
          new: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "User Experience updated",
        user: updatedUser,
      });
    } else if (req.method === "PUT") {
      const userId = session.user.id;
      const {
        expId,
        description,
        role,
        company,
        working,
        selectEndyear,
        selectJoinyear,
        selectEndmonths,
        selectJoinmonths,
      } = req.body;
      try {
        const user = await AboutUser.findOne({ user: userId });

        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }

        const experienceToUpdate = user.experience.find(
          (exp) => exp._id == expId
        );

        if (!experienceToUpdate) {
          return res.status(404).json({
            success: false,
            message: "Experience not found",
          });
        }

        // Update the experience object with new values
        experienceToUpdate.description = description;
        experienceToUpdate.Role = role;
        experienceToUpdate.company = company;
        experienceToUpdate.working = working;
        experienceToUpdate.endYear = selectEndyear;
        experienceToUpdate.joinYear = selectJoinyear;
        experienceToUpdate.endMonth = selectEndmonths;
        experienceToUpdate.joinMonth = selectJoinmonths;

        // Save the updated user
        await user.save();

        return res.status(200).json({
          success: true,
          message: "User Experience updated",
          user: user, // Return the updated user object
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
      }
    } else if (req.method === "DELETE") {
      const userId = session.user.id;
      const { exp } = req.query;
    
      try {
        const user = await AboutUser.findOneAndUpdate(
          { user: userId },
          {
            $pull: {
              experience: { _id: exp },
            },
          },
          { new: true }
        );
    
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
    
        return res.status(200).json({
          success: true,
          message: "Experience deleted successfully",
          user: user, // Return the updated user object
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message,
        });
      }
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

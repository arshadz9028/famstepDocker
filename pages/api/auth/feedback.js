import connectDb from "../../../database/conn";
import Feedback from "../../../model/feedback";
import User from "../../../model/userModel";
import { getSession } from "next-auth/react";
export default async function handler(req, res) {
    if (req.method === "POST") {
      const {fullname, Improvement, Features, Thoughts, additional , phoneEmail   } = req.body.values;
      const {selectedOption, userDevice} = req.body
        try {
            await connectDb();
            const newContact = new Feedback({
            name: fullname,
            feed:selectedOption,
            device:userDevice,
            Improvement,
            Features,
            Thoughts,
            additional,
            phoneEmail        
          });
        await newContact.save();

        // Get the current user's session
        const session = await getSession({ req });
        if (session) {
          const userId = session.user.id;
          
          // Update the user's userFeedback field to false
          await User.findByIdAndUpdate(
            userId,
            { userFeedback: false },
            { new: true }
          );
        }

        return res.status(200).json({ success: "success" });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
      }
    } else {
      return res.status(400).json({ error: "This method is not allowed" });
    }
  }
  // else if (req.method === "PUT") {
  //   try {
  //     const session = await getSession({ req }); // Ensure session is fetched correctly
  //     if (session) {
  //       const userId = session.user.id;

  //       const user = await User.findByIdAndUpdate(
  //         userId,
  //         { userFeedback: true },
  //         { new: true }
  //       );

  //       if (!user) {
  //         return res
  //           .status(404)
  //           .json({ success: false, error: "User not found" });
  //       }

  //       return res.status(200).json({ success: true, data: user });
  //     }
  //   } catch (error) {
  //     console.error("Error updating user feedback:", error);
  //     return res.status(500).json({ success: false, error: "Server error" });
  //   }
  // }
  // else {
  //   return res.status(400).json({ error: "This method is not allowed" });
  // }
// }

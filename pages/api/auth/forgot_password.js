import User from "../../../model/userModel";
import connectDb from "../../../database/conn";
import { sendVerificationEmail } from "../../../config/sendVerificationEmail";

export default async function handler(req, res) {
  try {
    await connectDb();

    if (req.method === "POST") {
      const { email } = req.body.values;
      // Check if the email is provided
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Find the user by email
      const user = await User.findOne().or([{ email:email }, { username:email }]);
      // If the user does not exist, return an error
      if (!user) {
        return res.status(404).json({ error: "User does not exist" });
      }

      // Generate a random OTP
      const token = Math.floor(100000 + Math.random() * 900000).toString();

      // Update the user's OTP
      await User.findByIdAndUpdate(
        user._id,
        { otp: token },
        { new: true }
      );
      const emailSend = user.email
      // Send the verification email
      await sendVerificationEmail(emailSend, token);

      return res.status(200).json({ success: "Verification email sent" });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in forgot password handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

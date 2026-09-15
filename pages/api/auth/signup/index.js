import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";
import { hash } from "bcryptjs";
import { sendVerificationEmail } from "../../../../config/sendVerificationEmail";
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, fullname, password } = req.body.values;
    const username = req.body.username1;
    if (
      !email.trim() ||
      (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) &&
        !/^\d{10}$/i.test(email))
    ) {
      return res
        .status(402)
        .json({ error: "Please enter your a valid phone or email" });
    } else if (!password.trim() || password.length < 6) {
      return res
        .status(402)
        .json({ error: "Password must be 6 characters or more" });
    } else if (
      !fullname.trim() ||
      !/^[a-zA-Z'-]+(\s[a-zA-Z'-]+){1,2}$/i.test(fullname)
    ) {
      return res
        .status(402)
        .json({ error: "Please enter your first and last names" });
    } else if (!username.trim() || !/^[a-zA-Z0-9_]{3,30}$/i.test(username)) {
      return res.status(402).json({ error: "Please enter a valid username." });
    }
    try {
      await connectDb();
      const user = await User.findOne().or([{ email }, { username }]);

      if (user) {
        return res
          .status(400)
          .json({ error: "This email or phone is already registered." });
      }
      const token = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Generate a temporary auth token for automatic login after verification
      const authToken = crypto.randomBytes(32).toString('hex');
      const authTokenExpiry = new Date();
      authTokenExpiry.setHours(authTokenExpiry.getHours() + 1); // Token expires in 1 hour
      
      const newUser = new User({
        email,
        name: fullname,
        username,
        password: await hash(password, 12),
        role: "User",
        otp: token,
        authToken: authToken,
        authTokenExpiry: authTokenExpiry
      });
      sendVerificationEmail(email, token);
      await newUser.save();
      
      // Return the auth token instead of the original password
      return res.status(200).json({ 
        success: "success", 
        userId: newUser._id,
        authToken: authToken
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(400).json({ error: "This method is not allowed" });
  }
}

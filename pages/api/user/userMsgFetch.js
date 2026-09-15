import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
export default async function handler(req, res) {
  try {
    await connectDb();
    const { message } = req.query;
    const userQuery = await User.findOne({ _id: message });

    return res.status(200).json({ success: true, data1: userQuery });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

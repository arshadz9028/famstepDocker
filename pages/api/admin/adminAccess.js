import connectDb from "../../../database/conn";
import Admin from "../../../model/admin";

export default async function handler(req, res) {
  try {
    // Connect to the database
    await connectDb();
    const id = '66e1cb643daceefc892270c1'
    const admin = await Admin.findById(id);

    

    return res.status(200).json({ success: true, message: "Admin created successfully", data: admin });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
}

import connectDb from "../../../database/conn";
import Contact from "../../../model/contactUs";
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, fullname, description } = req.body.values;
    try {
      await connectDb();
      const newContact = new Contact({
        email,
        name: fullname,
        message: description,
      });
      await newContact.save();
      return res.status(200).json({ success: "success" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    return res.status(400).json({ error: "This method is not allowed" });
  }
}

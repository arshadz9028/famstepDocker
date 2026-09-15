import { Schema, model, models } from "mongoose";
// import defaultpic from "../public/default.png";

const ContactSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },

  },
  { timestamps: true }
);

const Contact = models && models.Contact ? models.Contact : model("Contact", ContactSchema);

export default Contact;

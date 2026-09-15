import { Schema, model, models } from "mongoose";

const FamstepSchema = new Schema(
  {
    announcement: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Famstep = models.Famstep || model("Famstep", FamstepSchema);

export default Famstep;

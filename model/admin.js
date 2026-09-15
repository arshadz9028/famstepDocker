import { Schema, model, models } from "mongoose";
const AdminSchema = new Schema(
    {
       LaunchTime:{type:Date},
       contestCompleteDate:{type:Boolean}
    },
    { timestamps: true}
  );
  
  // const Admin = models.Admin || model("Admin", AdminSchema);
  const Admin = models && models.Admin ? models.Admin : model("Admin", AdminSchema);
  
  export default Admin;
  
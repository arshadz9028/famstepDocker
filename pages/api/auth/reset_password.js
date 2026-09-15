import User from "../../../model/userModel";
import connectDb from "../../../database/conn";
import {hash} from "bcryptjs"


export default async function handler (req, res) {
  await connectDb();
  try{
    const { password } = req.body.values;
    const {user_id} = req.body
    const update = await User.findById(user_id);
    if (!update){
      return res.status(400).json({message: "This account does not exist"});
    }
    const cryptedPassword = await hash(password,12);
    await update.updateOne({
      password:cryptedPassword
    });
    await User.findByIdAndUpdate(
      user_id,
      {
          otp: ''
      },
      { new: true }
  )
    return res.status(200).json({ Success: "user existed" });
    
  } catch(error){
    return res.status(400).json({error: "invalid"});
  }
};

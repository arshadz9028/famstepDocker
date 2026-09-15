import connectDb from "../../../../database/conn";
import User from "../../../../model/userModel";
export default async function handler(req, res) {

  try {
    await connectDb();

    if (req.method === "PUT") {
        const {userId,query} = req.body
        if(query.user){

          await User.findByIdAndUpdate(
            userId,
            {
              userEmailVerified: true,
              otp: ''
            },
            { new: true }
          )
          return res.status(200).json({ success: "success" });
        }else if(query.reset){
          await User.findByIdAndUpdate(
            userId,
            {
              otp: ''
            },
            { new: true }
          )
          return res.status(200).json({ success: "success" });
        }
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

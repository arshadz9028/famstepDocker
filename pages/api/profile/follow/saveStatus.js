// import connectDb from "../../../../database/conn";
// import frequest from "../../../../model/frequestModel";
// import { getSession } from "next-auth/react";

// const saveStatus = async (req, res) => {
//   if (req.method == 'PUT') {
//     try {
//       await connectDb();
//       const session = await getSession({ req });
//       const userId = session?.user.id;
//       const { followusername, status } = req.body;
//       console.log("statusFollow", status);
//       console.log("followusername", followusername);

//       if (!followusername) {
//         return res.status(400).json({ error: "Missing parameter: followusername" });
//       }

//       // Part 1: Find the user with session.user.id
//       const mineFollow = await frequest.findOne({ user: userId });
//       mineFollow.followRequests.forEach((follow) => {
//         follow.followStatus = status;
//       });
//       await mineFollow.save(); 

//       console.log("Updated User with FollowRequest", mineFollow);

//       return res.status(200).json({ message: "Request accepted", updatedUser: mineFollow });

//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   } else {
//     return res.status(405).json({ error: "Method not allowed" });
//   }
// }

// export default saveStatus;

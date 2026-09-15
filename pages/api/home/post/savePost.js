import connectDb from "../../../../database/conn";
import Post from "../../../../model/postModel";
import Collection from "../../../../model/postCollection";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  try {
    connectDb().catch(error => res.json({ error: 'connection failed...!' }))
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = session.user.id;
    const userName = session.user.username;

    if (req.method === "PUT") {
      const { id } = req.body;

      try {
        // Find or create a Collection for the user
        let data = await Collection.findOne({ userId });
        if (!data) {
          data = new Collection({ userId });
          await data.save();
        }

        let data1 = await Post.findById(id);

        if (!data1.collections.some(val => val == userId)) {
          data.PostCollections.push(id);
          await data.save();
          data1.collections.push(userId); 
          await data1.save();
          return res.status(200).json({ success: 'save', data });
        } else {
          data.PostCollections = data.PostCollections.filter((valu) => valu != id);
          data1.collections = data1.collections.filter((val) => val != userId);
          await data.save();
          await data1.save();
          return res.status(200).json({ success: 'unsave', data });
        }

      } catch (error) {
        return res.status(403).json({ message: error });
      }
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

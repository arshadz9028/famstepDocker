import connectDb from "../../../../database/conn";
import Post from "../../../../model/postModel";
import { awsS3 } from "../../../../config/awsS3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import Collection from "../../../../model/postCollection";

export default async function handler(req, res) {
  try {
    await connectDb();
    const { postUpdate } = req.query;

    if (req.method === "DELETE") {
      const post = await Post.findById(postUpdate);

      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }

      try {
        const s3DeletePromises = [];

        // Check if there are images to delete
        if (post?.images.length > 0 && post.images[0].image !== "") {
          const keys = post.images.map(del =>
            del.image.replace('https://famstep-storage.s3.ap-south-1.amazonaws.com/', '')
          );

          // Prepare deletion commands for all images
          keys.forEach(key => {
            const deleteParams = { Bucket: "famstep-storage", Key: key };
            s3DeletePromises.push(awsS3.send(new DeleteObjectCommand(deleteParams)));
          });
        } else if (post?.pracsUrl) {
          // If no images, check for `pracsUrl` and prepare for deletion
          const key1 = post.pracsUrl.replace('https://famstep-storage.s3.ap-south-1.amazonaws.com/', '');
          const deleteParamsCode = { Bucket: "famstep-storage", Key: key1 };
          s3DeletePromises.push(awsS3.send(new DeleteObjectCommand(deleteParamsCode)));
        }

        // Delete tags from user collections in a single batch operation
        const taggedUserIds = post.tag?.map(tag => tag.userid) || [] ;
        if (taggedUserIds.length > 0) {
          await Collection.updateMany(
            { userId: { $in: taggedUserIds } },
            { $pull: { PostTags: post._id } }
          );
        }

        const userCollection = post.collections?.map(coll => coll) || [];
        if (userCollection.length > 0) {
          await Collection.updateMany(
            { userId: { $in: userCollection } },
            { $pull: { PostCollections: post._id } }
          );
        }

        // Wait for all S3 deletions to complete in parallel
        await Promise.all(s3DeletePromises);

        // Remove the post from the database
        await post.remove();
        return res.status(200).json({ success: true, data: post });

      } catch (error) {
        console.error("Error deleting from S3 or updating database:", error);
        return res.status(500).json({ error: "Failed to delete from S3 or update database." });
      }

    } else if (req.method === "PUT") {
      const { inputCheck, taggedUser } = req.body;

      const post = await Post.findById(postUpdate);

      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }

      const updatePromises = [];

      // Update the post description if provided
      if (inputCheck || inputCheck === "") {
        post.desc = inputCheck;
      }

      // Update tags only if provided
      if (taggedUser && Array.isArray(taggedUser)) {
        const existingUserIds = post.tag.map(tag => tag.userid.toString());
        const usersToRemove = existingUserIds.filter(id => !taggedUser.includes(id));
        const usersToAdd = taggedUser.filter(id => !existingUserIds.includes(id));

        // Remove users from tags and update their collections
        if (usersToRemove.length > 0) {
          post.tag = post.tag.filter(tag => !usersToRemove.includes(tag.userid.toString()));
          updatePromises.push(
            Collection.updateMany(
              { userId: { $in: usersToRemove } },
              { $pull: { PostTags: post._id } }
            )
          );
        }

        // Add new users to the post's tag array and update/create the corresponding collections
        if (usersToAdd.length > 0) {
          usersToAdd.forEach(userId => {
            post.tag.push({ userid: userId.trim() });
            updatePromises.push(
              Collection.updateOne(
                { userId: userId },
                { $addToSet: { PostTags: post._id } }, // Add post ID only if it doesn't exist
                { upsert: true } // Create a new document if it doesn't exist
              )
            );
          });
        }
      }

      // Save the post and execute the updates in parallel for better performance
      updatePromises.push(post.save());
      await Promise.all(updatePromises);

      res.status(200).json({ success: true, data: post });
    } 

  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({ error: "Internal Server Error." });
  }
}

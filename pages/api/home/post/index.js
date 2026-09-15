import connectDb from "../../../../database/conn";
import { createRouter, expressWrapper } from "next-connect";
import { getSession } from "next-auth/react";
import { upload } from "../../../../config/multerMiddleware";
import Post from "../../../../model/postModel";
import followModel from "../../../../model/followModel";
import { awsS3 } from "../../../../config/awsS3";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import Collection from "../../../../model/postCollection";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const router = createRouter();

export default router.handler({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke! ");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
});

// Use multer.array() to allow multiple file uploads
router.use(upload.array("images", 10)).post(async (req, res) => {
  // "images" is the field name, 10 is the limit
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(400).json({ error: "Access denied" });
    } else {
      await connectDb();
      let { content, isGrpPost, GrpId, taggedUser, languageTag } = req.body;
     
      const username = session.user.username;
      const currentUser = session?.user?.id;
      
      const files = req.files; // Files from the request
      
      const uploadedFiles = [];
      
      // Upload each file to S3
      for (const file of files) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const pathUrl = `upload/${username}/post/`;
        const key = pathUrl + file.fieldname + "-" + uniqueSuffix + "-" + file.originalname;
        
        
        const putParams = {
          Bucket: "famstep-storage",
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        
        await awsS3.send(new PutObjectCommand(putParams));
        
        const fileUrl = `https://famstep-storage.s3.ap-south-1.amazonaws.com/${key}`;
        uploadedFiles.push({ image: fileUrl });
      }
      
      // Save post data along with the uploaded image URLs
      const post = new Post({
        desc: content || "",
        images: uploadedFiles.length ? uploadedFiles : [{ image: "" }],       
        userid: currentUser,
        isGrpPost,
        groupId: GrpId,
        commentsEnable: true,
      
      });

      // Add user from taggedUser array to the post's tag array
      const taggedUsersArray = taggedUser.split(",");
      if (taggedUsersArray != "") {
        for (const user of taggedUsersArray) {
          post.tag.push({ userid: user.trim() });
          let data = await Collection.findOne({ userId: user });
          if (!data) {
            data = new Collection({ userId: user });
            await data.save();
          }
          data.PostTags.push(post._id);
          await data.save();
        }
      }

      await post.save();

      // Update notifications for followers
      await followModel.updateMany(
        { "following.userid": currentUser },
        { $set: { "following.$.postNotification": true } }
      );

      res.status(200).json({ success: true, data: post });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

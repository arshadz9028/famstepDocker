import connectDb from "../../../../database/conn";
import { createRouter, expressWrapper } from "next-connect";
import { getSession } from "next-auth/react";
import { upload } from "../../../../config/multerMiddleware";
import User from "../../../../model/userModel";
import { awsS3 } from "../../../../config/awsS3";
import {  PutObjectCommand } from '@aws-sdk/client-s3';
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

    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
});

router.use(upload.single("backgroundImage"))
.post(async (req, res) => {
  try {
    const session = await getSession({ req });
    if (!session) {
      return res.status(400).json({ error: "Access denied" });
    } else {
      
      await connectDb();
      const username = session.user.username;
      const currentUser = session?.user?.id;
      const file = req.file;

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      const pathUrl = `upload/${username}/profile/`;

      const key =
        pathUrl + file.fieldname + "-" + uniqueSuffix + "-" + file.originalname;

      const putParams = {
        Bucket: "famstep-storage",
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await awsS3.send(new PutObjectCommand(putParams));
      const fileUrl = `https://famstep-storage.s3.ap-south-1.amazonaws.com/${key}`;



      const profileUpdate = await User.findByIdAndUpdate(currentUser, {
        background: fileUrl,
      });

      res.status(200).json({ success: true, data: profileUpdate });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

import connectDb from "../../../database/conn";
import { createRouter, expressWrapper } from "next-connect";
import { getSession } from "next-auth/react";
import { upload } from "../../../config/multerMiddleware";
import CreateGroup from "../../../model/createGrpModel";
import followModel from "../../../model/followModel";
import { awsS3 } from "../../../config/awsS3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
router
  .use(
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "backgroundImage", maxCount: 1 },
    ])
  )
  .post(async (req, res) => {
    try {
      const session = await getSession({ req });
      if (!session) {
        return res.status(400).json({ error: "Access denied" });
      } else {
        await connectDb();
        const admin = session?.user?.id;
        const { desc, name } = req.body;
        
        const profImage = req.files["image"][0];
        const backImage = req.files["backgroundImage"][0];

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const pathUrl = "group/profile/";
        const key1 =
        pathUrl + profImage.fieldname + "-" + uniqueSuffix + "-" + profImage.originalname;

        const key2 =
        pathUrl + backImage.fieldname + "-" + uniqueSuffix + "-" + backImage.originalname;
        const putParams1 = {
            Bucket: "famstep-storage",
            Key: key1,
            Body: profImage.buffer,
            ContentType: profImage.mimetype,
          };
          const putParams2 = {
            Bucket: "famstep-storage",
            Key: key2,
            Body: backImage.buffer,
            ContentType: backImage.mimetype,
          };
        await awsS3.send(new PutObjectCommand(putParams1));
        await awsS3.send(new PutObjectCommand(putParams2));
        const fileUrl = `https://famstep-storage.s3.ap-south-1.amazonaws.com/${key1}`;
        const fileBckUrl = `https://famstep-storage.s3.ap-south-1.amazonaws.com/${key2}`;

        const group = new CreateGroup({
          admin,
          groupName: name,
          description: desc,
          image: fileUrl,
          background: fileBckUrl,
          members: [{ user: admin }],
        });

        await group.save();
        const grpId = group._id;
        try {
          const grpFollow = await followModel.findOne({ user: admin });

          if (!grpFollow) {
            const newGrp = new followModel({
              user: admin,
              groupsAdded: [
                {
                  grpId,
                },
              ],
              followers: [],
              following: [],
              praise: [],
            });

            await newGrp.save();
          } else {
            if (!grpFollow.groupsAdded.some((value) => value.grpId == grpId)) {
              grpFollow.groupsAdded.push({
                grpId,
              });
              await grpFollow.save();
            }
          }
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json({ success: true, data: group });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  });

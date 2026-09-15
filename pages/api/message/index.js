import connectDb from "../../../database/conn";
import User from "../../../model/userModel";
import Message from "../../../model/messageModel";
import Chat from "../../../model/chatModel";
import { createRouter, expressWrapper } from "next-connect";
import { getSession } from "next-auth/react";
import { upload } from "../../../config/multerMiddleware";
import CryptoJS from "crypto-js";

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
router.use(upload.single("image")).post(async (req, res) => {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(400).json({ error: "Access denied" });
    } else {
      let { chatId, content, selectedId  } = req.body;

      if (!chatId) {
        return res.status(400).json({ error: "Select user for message" });
      }
      await connectDb();
      const currentUser = session?.user?.id;
      let fileUrl;

      if (req.file) {
        const file = req.file;
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const pathUrl = `upload/${session.user.username}/message/`;
        const key = pathUrl + file.fieldname + "-" + uniqueSuffix + "-" + file.originalname;
        const putParams = {
          Bucket: "famstep-storage",
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        await awsS3.send(new PutObjectCommand(putParams));

        fileUrl = `https://famstep-storage.s3.ap-south-1.amazonaws.com/${key}`;
      }


      const secret = process.env.ENCRYPTION_KEY;
      const encryptedText = CryptoJS.AES.encrypt(content, secret).toString();
      

      let newMessage = {
        sender: currentUser,
        UserR: { recieverUser: selectedId, isCleared: false },
        UserS: { currentUser, isCleared: false },
        attachUrl: fileUrl || "",
        content: encryptedText || "",
        chat: chatId,
       postId:''
      };
      let message = await Message.create(newMessage);
      message = await message.populate("sender", "name username image");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name username image",
      });
      message.content = content;
      await Chat.findByIdAndUpdate(
        chatId,
        {
          $set: {
            latestMessage: message,
            newMessage: true,
          },
        },
        { new: true }
      );
      await Chat.updateMany(
        {
          _id: chatId,
          "chatLength": {
            $elemMatch: {
              $or: [
                { senderUser: currentUser },
                { senderUser: selectedId }
              ],
              isClear: true // Only update when isClear is true
            }
          }
        },
        { $set: { "chatLength.$[elem].isClear": false } }, // Update isClear to false
        { multi: true, arrayFilters: [{ "elem.isClear": true }] }
      );

      const userMsgData = await Chat.findById(chatId)
      .populate("users")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    await Chat.populate(userMsgData, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
        userMsgData.latestMessage.content = content;

      res.json({ message: message, userMsgData });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

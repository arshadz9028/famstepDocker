import { Schema, model, models } from "mongoose";
const CreateGrpSchema = new Schema(
    {
        admin: { type: Schema.Types.ObjectId, ref: "User" },
        groupName: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        background: { type: String, required: true },
        members: [{

            user: { type: Schema.Types.ObjectId, ref: "User" },

        }]
    },
    { timestamps: true }
);

const CreateGroup = models && models.CreateGroup ? models.CreateGroup : model("CreateGroup", CreateGrpSchema);

export default CreateGroup;  
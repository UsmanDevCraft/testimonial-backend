import mongoose from "mongoose";
const { Schema } = mongoose;

const NewSpaceModel = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usermodel",
    },
    spaceName: {
      type: String,
      require: true,
      unique: true,
    },
    spaceDesc: {
      type: String,
      require: true,
    },
    customMessage: {
      type: String,
      require: true,
    },
    spaceToken: {
      type: String,
    },
  },
  {
    versionKey: false,
  },
);

NewSpaceModel.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.user;
    return ret;
  },
});

export default mongoose.model("NewSpaceModel", NewSpaceModel);

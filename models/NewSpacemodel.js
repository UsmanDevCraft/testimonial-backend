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
    },
    spaceDesc: {
      type: String,
      require: true,
    },
    customMessage: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

NewSpaceModel.index({ spaceName: 1, user: 1 }, { unique: true });

export default mongoose.model("NewSpaceModel", NewSpaceModel);

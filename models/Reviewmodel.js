import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewModel = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usermodel",
    },
    space_id: {
      type: String,
      require: true,
    },
    review: {
      type: String,
      require: true,
    },
    reviewer_name: {
      type: String,
      require: true,
    },
    reviewer_email: {
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

export default mongoose.model("ReviewModel", ReviewModel);

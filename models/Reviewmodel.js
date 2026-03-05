import mongoose from "mongoose";
const { Schema } = mongoose;

const ReviewModel = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usermodel",
  },
  space: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NewSpaceModel",
  },
  review: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
});

export default mongoose.model("ReviewModel", ReviewModel);

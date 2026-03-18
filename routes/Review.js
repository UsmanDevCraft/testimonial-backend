import express from "express";
import mongoose from "mongoose";
import fetchuser from "../middleware/fetchuser.js";
import ReviewModel from "../models/Reviewmodel.js";
import NewSpaceModel from "../models/NewSpacemodel.js";
import { apiReadLimiter, apiWriteLimiter } from "../rate_limits/app.js";

const router = express.Router();

// < ------------------------------- CREATE A NEW REVIEW ------------------------------- >
router.post(
  "/create-review/:id",
  apiWriteLimiter,
  fetchuser,
  async (req, res) => {
    try {
      const { review, reviewer_name, reviewer_email } = req.body;

      const spaceId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(spaceId)) {
        return res.status(400).json({ message: "Invalid Space ID format." });
      }

      const space = await NewSpaceModel.findOne({
        user: req.user.id,
        _id: spaceId,
      });

      if (!space) {
        return res.status(404).json({
          message: "Invalid space ID, space not found.",
        });
      }

      let newReview = new ReviewModel({
        review,
        reviewer_name,
        reviewer_email,
        user: req.user.id,
        space_id: spaceId,
      });

      const savedReview = await newReview.save();
      res.send({ data: savedReview, message: "Review created successfully!" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// < ------------------------------- READ REVIEW BY ID ------------------------------- >
router.get("/get-review/:id", apiReadLimiter, fetchuser, async (req, res) => {
  try {
    const reviewId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid Review ID format." });
    }

    const review = await ReviewModel.findOne({
      user: req.user.id,
      _id: reviewId,
    });

    if (!review) {
      return res.status(404).json({
        message: "Invalid review ID, review not found.",
      });
    }

    res.send({ data: review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// < ------------------------------- DELETE THE NEW REVIEW ------------------------------- >
router.delete(
  "/delete-review/:id",
  apiWriteLimiter,
  fetchuser,
  async (req, res) => {
    try {
      const review_id = req.params.id;
      let delReview = await ReviewModel.findById(review_id);
      if (!delReview) {
        return res
          .status(404)
          .json({ error: "Review doesnot exist or already deleted." });
      }

      if (delReview.user.toString() !== req.user.id) {
        return res
          .status(401)
          .json({ error: "Editing Not Allowed, you dont own this space." });
      }

      delReview = await ReviewModel.findByIdAndDelete(review_id);
      res.send({ data: delReview, message: "Review Deleted Successfully." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// < ------------------------ GET ALL REVIEWS ------------------------ >
router.get(
  "/get-all-reviews/:id",
  apiReadLimiter,
  fetchuser,
  async (req, res) => {
    try {
      const spaceId = req.params.id;

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 15;

      const skip = (page - 1) * limit;

      const [reviews, totalCount] = await Promise.all([
        ReviewModel.find({ space_id: spaceId, user: req.user.id })
          .sort({ createdAt: -1 }) // Recommended: show newest review first
          .skip(skip)
          .limit(limit),
        ReviewModel.countDocuments({ space_id: spaceId, user: req.user.id }),
      ]);

      res.status(200).json({
        success: true,
        data: reviews,
        pagination: {
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          limit: limit,
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

export default router;

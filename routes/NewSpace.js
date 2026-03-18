import mongoose from "mongoose";
import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import NewSpaceModel from "../models/NewSpacemodel.js";
import Usermodel from "../models/Usermodel.js";
import fetchspace from "../middleware/fetchspace.js";
import { validateSpace } from "../middleware/validations/validateSpace.js";
import { apiReadLimiter, apiWriteLimiter } from "../rate_limits/app.js";

const router = express.Router();

// < ------------------------------- CREATE A NEW SPACE ------------------------------- >
router.post(
  "/createspace",
  apiWriteLimiter,
  fetchuser,
  validateSpace,
  async (req, res) => {
    try {
      const { spaceName, spaceDesc, customMessage } = req.body;

      const space_exists = await NewSpaceModel.findOne({
        spaceName,
        user: req.user.id,
      });

      if (space_exists) {
        return res.status(400).json({
          message:
            "Space with this name already exists. Please use a different name.",
        });
      }

      let space = new NewSpaceModel({
        spaceName,
        spaceDesc,
        customMessage,
        user: req.user.id,
      });

      const savedSpace = await space.save();

      res.send({ data: savedSpace, message: "Space created successfully!" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// < ------------------------------- READ ALL SPACES ------------------------------- >
router.get("/getspace", apiReadLimiter, fetchuser, async (req, res) => {
  try {
    // 1. Extract and sanitize query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    // 2. Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // 3. Run both queries in parallel for better performance
    const [spaces, totalCount] = await Promise.all([
      NewSpaceModel.find({ user: req.user.id })
        .sort({ createdAt: -1 }) // Recommended: show newest spaces first
        .skip(skip)
        .limit(limit),
      NewSpaceModel.countDocuments({ user: req.user.id }),
    ]);

    // 4. Return the data along with pagination metadata
    res.status(200).json({
      success: true,
      data: spaces,
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
});

// < ------------------------------- READ SPACE BY ID ------------------------------- >
router.get("/getSpaceById/:id", apiReadLimiter, fetchuser, async (req, res) => {
  try {
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

    res.send({ data: space });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// < ------------------------------- UPDATE AN EXISTING SPACE ------------------------------- >
router.put("/updatespace/:id", apiWriteLimiter, fetchuser, async (req, res) => {
  try {
    const { spaceName, spaceDesc, customMessage } = req.body;
    const id = req.params.id;
    const newSpace = {};
    if (spaceName) {
      newSpace.spaceName = spaceName;
    }
    if (spaceDesc) {
      newSpace.spaceDesc = spaceDesc;
    }
    if (customMessage) {
      newSpace.customMessage = customMessage;
    }

    let space = await NewSpaceModel.findById(id);
    if (!space) {
      return res.status(404).json({
        message: "Space Doesnot not exist, please make a space first.",
      });
    }

    if (space.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: "You don't have permission to edit this space.",
      });
    }

    space = await NewSpaceModel.findByIdAndUpdate(
      id,
      { $set: newSpace },
      { new: true },
    );
    res.send({ data: space, message: "Space Updated Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// < ------------------------------- DELETE THE NEW SPACE ------------------------------- >
router.delete(
  "/deletespace/:id",
  apiWriteLimiter,
  fetchuser,
  async (req, res) => {
    try {
      const id = req.params.id;
      let space = await NewSpaceModel.findById(id);
      if (!space) {
        return res.status(404).json({
          message: "Space Doesn't exist.",
        });
      }

      if (space.user.toString() !== req.user.id) {
        return res
          .status(401)
          .json({ message: "You don't have permission to edit this space." });
      }

      space = await NewSpaceModel.findByIdAndDelete(id);
      res.send({ data: space, message: "Space Deleted Successfully!" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// < ------------------------ GET REVIEWS OF THE NEW SPACE (SEPERATELY) ------------------------ >
router.post("/getspacereviews", fetchuser, fetchspace, async (req, res) => {
  try {
    const id = req.space.id;
    const id2 = req.user.id;
    const space = await NewSpaceModel.findById(id);
    const user = await Usermodel.findById(id2);
    res.send({ space, user });
  } catch (error) {
    res.json({ error: error.message });
  }
});

export default router;

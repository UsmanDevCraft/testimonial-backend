import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import NewSpaceModel from "../models/NewSpacemodel.js";
import Usermodel from "../models/Usermodel.js";
import fetchspace from "../middleware/fetchspace.js";
import { validateSpace } from "../middleware/validations/validateSpace.js";

const router = express.Router();

// < ------------------------------- CREATE A NEW SPACE ------------------------------- >
router.post("/createspace", fetchuser, validateSpace, async (req, res) => {
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
});

// < ------------------------------- READ THE NEW SPACE ------------------------------- >
router.get("/getspace", fetchuser, async (req, res) => {
  try {
    let space = await NewSpaceModel.find({ user: req.user.id });

    res.send({ data: space });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// < ------------------------------- UPDATE AN EXISTING SPACE ------------------------------- >
router.put("/updatespace/:id", fetchuser, async (req, res) => {
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
      return res
        .status(404)
        .json({ error: "Space Doesnot not exist, please make a space first." });
    }

    if (space.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Editing Not Allowed, you dont own this space." });
    }

    space = await NewSpaceModel.findByIdAndUpdate(
      id,
      { $set: newSpace },
      { new: true },
    );
    res.send(space);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// < ------------------------------- DELETE THE NEW SPACE ------------------------------- >
router.delete("/deletespace/:id", fetchuser, async (req, res) => {
  try {
    const id = req.params.id;
    let space = await NewSpaceModel.findById(id);
    if (!space) {
      return res
        .status(404)
        .json({ error: "Space Doesnot not exist, please make a space first." });
    }

    if (space.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ error: "Editing Not Allowed, you dont own this space." });
    }

    space = await NewSpaceModel.findByIdAndDelete(id);
    res.send({ space, message: "Space Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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

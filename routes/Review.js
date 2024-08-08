const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const ReviewModel = require("../models/Reviewmodel");
const fetchspace = require("../middleware/fetchspace");

const router = express.Router();


// < ------------------------------- CREATE A NEW REVIEW ------------------------------- >
router.post("/createreview", fetchuser, fetchspace , async (req, res) => {
    try {
        const { review, name, email} = req.body;

        // const ifReviewExists = await ReviewModel.findOne({email});
        // if(ifReviewExists){
        //     return res.status(400).json({error: "An Email can give a review only once. Delete the existing one to get another."})
        // }

        // console.log('req.space:', req.space);

        let newReview = new ReviewModel({
            review,
            name,
            email,
            user: req.user.id,
            space: req.space.id
        });

        const savedReview = await newReview.save();
        // console.log({"req.space.id": req.space.id})
        res.send(savedReview);

    } catch (error) {
        res.status(400).json({error: error.message})
    }
})


// < ------------------------------- READ THE NEW REVIEW ------------------------------- >
router.get("/getreview", fetchuser, fetchspace , async (req, res) => {
    try {

        let reviewExists = await ReviewModel.find({ space: req.space.id });
        // console.log(req.user.id);
        // console.log(req.space.id);
        res.send(reviewExists);

    } catch (error) {
        res.status(400).json({error: error.message})
    }
});


// < ------------------------------- DELETE THE NEW REVIEW ------------------------------- >
router.delete("/deletereview/:id", fetchuser, fetchspace , async (req, res) => {
    try {
        const id = req.params.id;
        let delReview = await ReviewModel.findById(id);
        if(!delReview){
            return res.status(404).json({error: "Review doesnot exist or already deleted."})
        }

        if(delReview.user.toString() !== req.user.id){
            return res.status(401).json({error: "Editing Not Allowed, you dont own this space."});
        }

        delReview = await ReviewModel.findByIdAndDelete(id);
        res.send({delReview, msg: "Review Deleted Successfully."})

    } catch (error) {
        res.status(400).json({error: error.message})
    }
})


// < ------------------------ GET REVIEWS OF THE NEW SPACE (SEPERATELY) ------------------------ >
router.get("/getspacereviews", fetchuser, fetchspace , async (req, res) => {
    try {
        const spaceId = req.query.spaceId;

        // Fetch reviews associated with the space
        // const reviews = await ReviewModel.find({ space: spaceId })
        // res.json(reviews);

        const reviews = await ReviewModel.find({ space: spaceId });
            // .populate('space')  // Populates the space field with the corresponding NewSpaceModel document
            // .populate('user');  // Populates the user field with the corresponding Usermodel document

            res.json(reviews);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



module.exports = router;
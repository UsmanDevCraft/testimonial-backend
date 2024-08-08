const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const NewSpaceModel = require("../models/NewSpacemodel");
const Usermodel = require("../models/Usermodel");
const secret_key_space = "space12345";
const jwt = require("jsonwebtoken");
const fetchspace = require("../middleware/fetchspace");

const router = express.Router();


// < ------------------------------- CREATE A NEW SPACE ------------------------------- >
router.post("/createspace", fetchuser, async (req, res) => {
    try {
        const { spaceName, headerTitle, customMessage } = req.body;
        let space = new NewSpaceModel({
            spaceName,
            headerTitle,
            customMessage,
            user: req.user.id
        });


        // const dataSpace = {
        //     space: {
        //         id: savedSpace._id.toString()
        //     }
        // };

        // const spaceToken = jwt.sign(dataSpace, secret_key_space);

        const spaceToken = jwt.sign( {id: space._id.toString()} , secret_key_space )

        space.spaceToken = spaceToken;


        const savedSpace = await space.save();

        // console.log('savedSpace:', savedSpace); // Debug savedSpace
        // console.log('savedSpace.id:', savedSpace.id); // Debug savedSpace.id

        // if (!savedSpace || !savedSpace.id) {
        //     return res.status(500).json({ error: "Failed to create space." });
        // }

        
        // console.log({"data for space login": dataSpace, spaceToken})
        // console.log(savedSpace.id)

        res.send({ savedSpace });

    } catch (error) {
        res.status(400).json({error: error.message})
    }
})


// < ------------------------------- READ THE NEW SPACE ------------------------------- >
router.get("/getspace", fetchuser, async (req, res) => {
    try {
        let space = await NewSpaceModel.find({user: req.user.id});

        // const dataSpace = {
        //     space: {
        //         id: space.id
        //     }
        // };
        // const spaceToken = jwt.sign(dataSpace, secret_key_space)

        // console.log({"data for space login using get": dataSpace})

        res.send({ space });
        // res.json( space );

        // res.send(space)

    } catch (error) {
        res.status(400).json({error: error.message})
    }
})


// < ------------------------------- UPDATE AN EXISTING SPACE ------------------------------- >
router.put("/updatespace/:id", fetchuser, async (req, res) => {
    try {
        const { spaceName, headerTitle, customMessage } = req.body;
        const id = req.params.id;
        const newSpace = {};
        if(spaceName){newSpace.spaceName = spaceName};
        if(headerTitle){newSpace.headerTitle = headerTitle};
        if(customMessage){newSpace.customMessage = customMessage};

        let space = await NewSpaceModel.findById(id);
        if(!space){
            return res.status(404).json({error: "Space Doesnot not exist, please make a space first."})
        }

        if(space.user.toString() !== req.user.id){
            return res.status(401).json({error: "Editing Not Allowed, you dont own this space."});
        }

        space = await NewSpaceModel.findByIdAndUpdate(id, {$set: newSpace}, {new: true})
        res.send(space);

    } catch (error) {
        res.status(400).json({error: error.message})
    }
})



// < ------------------------------- DELETE THE NEW SPACE ------------------------------- >
router.delete("/deletespace/:id", fetchuser, async (req, res) => {
    try {
        const id = req.params.id;
        let space = await NewSpaceModel.findById(id);
        if(!space){
            return res.status(404).json({error: "Space Doesnot not exist, please make a space first."})
        }

        if(space.user.toString() !== req.user.id){
            return res.status(401).json({error: "Editing Not Allowed, you dont own this space."});
        }

        space = await NewSpaceModel.findByIdAndDelete(id);
        res.send({space, message: "Space Deleted Successfully"})

    } catch (error) {
        res.status(400).json({error: error.message})
    }
});


// < ------------------------ GET REVIEWS OF THE NEW SPACE (SEPERATELY) ------------------------ >
router.post("/getspacereviews", fetchuser, fetchspace, async (req, res) => {
    try {
        const id = req.space.id;
        const id2 = req.user.id;
        const space = await NewSpaceModel.findById(id);
        const user = await Usermodel.findById(id2);
        res.send({space, user});

    } catch (error) {
        res.json({error: error.message})
    }
})


module.exports = router;
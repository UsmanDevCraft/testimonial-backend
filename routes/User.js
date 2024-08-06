const express = require("express");
const Usermodel = require("../models/Usermodel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const router = express.Router();
const secret_key = "usman12345";


// < ------------------------------- CREATE A NEW USER ------------------------------- >
router.post("/createuser", async (req, res)=>{
    try {
        const { name, email, password } = req.body;
        let user = await Usermodel.findOne({email: email})
        if(user){
            return res.status(400).json({error: "User already exists, please try another email."});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);
        user = new Usermodel({
            name: name,
            email: email,
            password: hashPass
        });

        const savedUser = await user.save();

        const data = {
            user: {
                id: user.id,
            }
        };
        const authToken = await jwt.sign(data, secret_key);
        res.send({savedUser, authToken});

    } catch (error) {
        res.status(400).json({error: error.message})
    }
})


// < ------------------------------- LOGIN THE NEW USER ------------------------------- >
router.post('/loginuser', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await Usermodel.findOne({email: email});
        if(!user){
            return res.status(404).json({error: "User doesnot exist, please try again."}) 
        }

        const compPass = await bcrypt.compare(password, user.password);
        if(!compPass){
            return res.status(400).json({error: "Incorrect Credentials, please try again correclty."})
        }

        const data = {
            user: {
                id: user.id,
            }
        };
        const authToken = await jwt.sign(data, secret_key);
        // console.log({"data for user login": data})
        res.send({authToken});

    } catch (error) {
        res.status(400).json({error: error.message})
    }
});


// < ------------------------------- GET DATA OF THE NEW USER ------------------------------- >
router.post("/getuser", fetchuser, async (req, res)=>{
    try {
        const id = req.user.id;
        const user = await Usermodel.findById(id).select("-password");
        res.send(user);

    } catch (error) {
        res.status(400).json({error: error.message})
    }
});


module.exports = router;
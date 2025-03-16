const express=require("express")
const bcrypt=require("bcrypt")
const {ValidateSignupData}=require("../util/Validation")
const User=require("../model/user")
const jwt = require("jsonwebtoken");

const router=express.Router()

router.post("/signup",async (req, res) => {
    try {
        // Extract data from request body
        const { firstName, lastName, emailId, password } = req.body;

        // Validate the input data
        ValidateSignupData(req);

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10); // Use await

        // Create a new instance of the User model
        const userObj = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash, // Use the hashed password
        });

        // Save the user in the database
        await userObj.save();

        // Send success response
        res.status(200).send(userObj);
    } catch (e) {
        // Log and send the error
        console.error(e);
        res.status(400).send({ error: e.message });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Validate input
        if (!emailId || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }


        // Check if user exists
        const user = await User.findOne({emailId:emailId});
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials in user." });
        }

        // Validate password
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials in password." });
        }

        if(isPasswordValid){
        // Create JWT token with expiration
        const token = await user.getJWT();
        res.cookie("token",token,{
            expires:new Date(Date.now()+8*3600000),
        })
        }
        // Respond to the client
        res.status(200).json({ message: "Login successful." });
    } catch (e) {
        console.error("======",e.message);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
    })
    
    res.send("Logout Successful");
})
module.exports=router
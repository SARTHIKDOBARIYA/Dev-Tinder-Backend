const express=require('express')
const app=express()
require("./src/config/database")
const connectDB = require("./src/config/database");
const User=require("./src/model/user")

app.use(express.json())

app.post("/signup",async (req, res) => {

    const userObj=new User(req.body);
    // create new instance of the user model
    // const userObj = new User({
    //     firstName: "Sarthik",
    //     lastName: "Dobariya",
    //     emailId: "sarthik@gmail.com",
    //     password: "Sarthik@131"
    // })

    try {
        await userObj.save();
        res.status(200).send(userObj)
    }catch (e) {
        res.status(400).send("error in signup")
    }
})

//get user by email
app.get("/user",async (req, res) => {
    const email = req.body.emailId;

    try {
        const user=await User.findOne({emailId: email})
        if(!user){
            res.status(404).send("user not found")
        }
        res.status(200).send(user)
    }catch (e) {
        res.status(404).send("something went wrong")
    }
})

// Feed API - get/feed - get all the user from the database
app.get("/feed",async (req, res) => {

    try {
        const alluser = await User.find({})
        res.status(200).send(alluser)
    } catch (e) {
        res.status(404).send("Something went wrong ion feed API")
    }
})

// delete user
app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    try{
        // const user=await User.findByIdAndDelete({_id:userId})
        const user=await User.findByIdAndDelete(userId)

        res.status(200).send("User Deleted successfully")
    }catch (e) {
        res.status(404).send("something went wrong")
    }
})

// update data of the user
app.patch("/user/:id",async(req,res)=>{
    const data=req.body;

    try{
        const userId=req.params.id;
        await User.findByIdAndUpdate(userId,data,{new:true})
        res.status(200).send(data)

    }catch (e) {
        res.status(404).send("something went wrong in update")
    }
})

connectDB()
    .then(()=>{
        console.log("Database connected successfully")
        app.listen(3000,()=>{
            console.log("Server is running on port 3000")
        })
    })
.catch((err)=>{
    console.log(err)
})
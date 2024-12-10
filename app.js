const express=require('express')
const app=express()
require("./src/config/database")
const connectDB = require("./src/config/database");
const User=require("./src/model/user")
const {ValidateSignupData}=require("./src/util/Validation")
const bcrypt=require("bcrypt")

app.use(express.json())

app.post("/signup",async (req, res) => {
    try{
    // Validation of data
    ValidateSignupData(req)

    //Encrypt the password 
    const passwordHash=bcrypt.hash(password,10)
    console.log(passwordHash);

    //creating a new instance of the User model
    const userObj=new User({
        firstName,
        lastName,
        emailId,
        password:passwordHash
    });

    // create new instance of the user model
    // const userObj = new User({
    //     firstName: "Sarthik",
    //     lastName: "Dobariya",
    //     emailId: "sarthik@gmail.com",
    //     password: "Sarthik@131"
    // })

    
        await userObj.save();
        res.status(200).send(userObj)
    }catch (e) {
        res.status(400).send("error in signup")
    }
})

app.post("/login",async(req,res)=>{

    try{
        const{emailId,password}=req.body;

        const user=await User.findOne(emailId)
        if(!user){
            throw new Error("Invalid credential")
        }

        const isPasswordValid=await bcrypt.compare(password,user.password)

        if(isPasswordValid){
            res.send("Login successfull")
        }
        else{
            throw new Error("Invalid credential")
        }
    }
    catch(e){
        console.log(e.message);
    }
}))

//get user by email
app.get("/user",async (req, res) => {
    const email = req.body.emailId;

    try {
        const user=await User.findOne({emailId: email})
        if(!user){
            res.status(404).send("user not found")
        }
        else{
            res.status(200).send(user)
        }
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
    const userId=req.params?.id;

    try{
        const ALLOWED_UPDATES=["userId","photourl","about","gender","skills"]

        const isupdateallowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))

        if(!isupdateallowed){
            throw new Error("update not allowed")
        }

        if(data?.skills.length >10){
            throw new Error("skills are not more than 10")
        }

        await User.findByIdAndUpdate(userId,data,{new:true},{runValidators:true})
        res.status(200).send(data)

    }catch (e) {
        res.status(404).send("UPDATE FAILED"+e.message)
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
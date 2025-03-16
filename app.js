const express=require('express')
const app=express()
require("./src/config/database")
const connectDB = require("./src/config/database");
const User=require("./src/model/user")
const cookieparser=require("cookie-parser")

app.use(express.json())
app.use(cookieparser())

const authRouter=require('./src/routes/auth')
const profileRouter=require('./src/routes/profile')
const requestRouter=require('./src/routes/request')

//get user by email
// app.get("/user",async (req, res) => {
//     const email = req.body.emailId;

//     try {
//         const user=await User.findOne({emailId: email})
//         if(!user){
//             res.status(404).send("user not found")
//         }
//         else{
//             res.status(200).send(user)
//         }
//     }catch (e) {
//         res.status(404).send("something went wrong")
//     }
// })

// // Feed API - get/feed - get all the user from the database
// app.get("/feed",async (req, res) => {

//     try {
//         const alluser = await User.find({})
//         res.status(200).send(alluser)
//     } catch (e) {
//         res.status(404).send("Something went wrong ion feed API")
//     }
// })

// // delete user
// app.delete("/user",async(req,res)=>{
//     const userId=req.body.userId;
//     try{
//         // const user=await User.findByIdAndDelete({_id:userId})
//         const user=await User.findByIdAndDelete(userId)

//         res.status(200).send("User Deleted successfully")
//     }catch (e) {
//         res.status(404).send("something went wrong")
//     }
// })

// // update data of the user
// app.patch("/user/:id",async(req,res)=>{
//     const data=req.body;
//     const userId=req.params?.id;

//     try{
//         const ALLOWED_UPDATES=["userId","photourl","about","gender","skills"]

//         const isupdateallowed=Object.keys(data).every((k)=>ALLOWED_UPDATES.includes(k))

//         if(!isupdateallowed){
//             throw new Error("update not allowed")
//         }

//         if(data?.skills.length >10){
//             throw new Error("skills are not more than 10")
//         }

//         await User.findByIdAndUpdate(userId,data,{new:true},{runValidators:true})
//         res.status(200).send(data)

//     }catch (e) {
//         res.status(404).send("UPDATE FAILED"+e.message)
//     }
// })

app.use('/',authRouter);
app.use('/profile',profileRouter);
app.use('/request',requestRouter);

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
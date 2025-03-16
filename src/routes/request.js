const express=require('express')
const route=express.Router()
const {userAuth}=require("../middleware/auth")



route.post("/sendConnectionRequest",userAuth,async(req,res)=>{

    // send connection Request
res.send("send connection")
})

module.exports=route
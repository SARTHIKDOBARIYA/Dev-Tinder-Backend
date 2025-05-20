const express=require('express')
const route=express.Router()
const {userAuth}=require("../middleware/auth");
const ConnectionRequest = require('../model/connectionRequest');
const User = require("../model/user");

route.post("/send/:status/:toUserId",
userAuth,
async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedstatus=["ignored","interested"]
        if(!allowedstatus.includes(status)){
            return res.status(400).json({message:"Invalid status type "+ status})
        }

        const toUser=await User.findById(toUserId)
        if(!toUser){
            return res.status(404).json({message:'User not found'})
        }    

        // If there is existing Schema Request

        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                { fromUserId,toUserId},
                { fromUserId:toUserId,toUserId:fromUserId},
            ]
        })
        if(existingConnectionRequest){
            return res.status(400).send({message:"connection Request already sent"})
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data=await connectionRequest.save()

        res.status(200).json({
            message:req.user.firstName+" is "+status+" in "+toUser.firstName,
            data
        })
    }
    catch(err){
        res.status(400).send("ERROR: " + err.message)
    }
})

route.post("/review/:status/:requestId",
userAuth,
async(req,res)=>{
    try{
    const user=req.user;
    const {status,requestId}=req.params

    //validate status

    const allowedstatus=["accepted","rejected"]
    if(!allowedstatus.includes(status)){
        return res.status(400).json({message:"status is invalid"})
    }

    const connectionRequest=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:user._id,
        status:"interested"
    });

    if(!connectionRequest){
        return res.status(404).json({message:"connection is not found"})
    }

    connectionRequest.status=status;
    const data=await connectionRequest.save()

    res.status(200).send({message:`connection Request ${status} ${data}`})


    }
    catch(e){
        res.status(400).send("Error:" + e.message)
    }
})


module.exports=route
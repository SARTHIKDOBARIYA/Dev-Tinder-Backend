const express=require('express')
const route=express.Router()
const {userAuth}=require("../middleware/auth");
const ConnectionRequest = require('../model/connectionRequest');


route.get('/requests/received',userAuth,async(req,res)=>{
    try{    
    const user=req.user;

    const connnectionRequest=await ConnectionRequest.find({
        touserId:user._id,
        status:'interested',
    }).populate("fromUserId","firstName lastName")

    if(!connnectionRequest){
        console.log("connection Request not Found")
    }

    return res.status(400).json({message:"request found",data:connnectionRequest})

    }catch(e){
        return res.status(400).json({message:`error in request ${e.message}`})
    }
})

route.get('/request/connections',userAuth,async(req,res)=>{
    try{

        const loggedInuser=req.user;

        const connection_request=await ConnectionRequest.find({
            $or:[
                {touserId:loggedInuser._id,status:'accepted'},
                {fromUserId:loggedInuser._id,status:'accepted'}
            ]
        })
        .populate("fromUserId","firstName")
        .populate("touserId","firstName")

        const  data=connection_request.map((raw)=>{
            if(raw.fromUserId._id.toString() === loggedInuser._id.toString()){
            return raw.toUserId
            }else{
                return raw.fromUserId
            }
        }
        )
        return res.json({data})

    }catch(e){
        console.log("error in user->connection",e)
    }
})
module.exports=route;
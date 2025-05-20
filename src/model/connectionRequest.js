const mongoose=require("mongoose")

const connectionRequestSchema=new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.ObjectId,
        ref:'User', // reference to the user
        required:true
    },
    toUserId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is not valid status`
        }
    }
},
{ timestamps:true }
);


connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;

    // check if fromUserId is same as toUserId
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Can't send connection request to yourself")
    }
    next()
})

connectionRequestSchema.index({fromUserId:1 , toUserId:1})


const ConnectionRequestModel=mongoose.model("connectionRequest",connectionRequestSchema,"connectionRequest")
module.exports=ConnectionRequestModel
const mongoose=require("mongoose")
const validator=require("validator")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:4,
        maxLength:16
    },
    lastName:{
        type:String,
    },
    emailId:{
        type:String,
        lowercase:true, 
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address"+value)
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a Strong Password")
            }
        }
    },
    age:{
        type:String,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photourl:{
        type:String,
        // default:""
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photourl"+value)
            }
        }
    },
    about:{
        type:String,
        default:"This is default about of the user"
    },
    skills:{
        type:[String]
    }
},{timestamps:true})

const User=mongoose.model("User",userSchema)

module.exports=User;
const validator=require("validator")

const ValidateSignupData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body

    if(!firstName || !lastName){
        throw new Error("Name is not Valid")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter Strong Password")
    }

}

module.exports={
    ValidateSignupData
}
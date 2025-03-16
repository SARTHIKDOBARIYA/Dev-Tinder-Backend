const express=require("express")
const router=express.Router()
const bcrypt=require("bcrypt")
const {userAuth}=require("../middleware/auth")
const {validateEditProfile}=require("../util/Validation")


router.get("/",userAuth,async (req, res) => {
    try {
        const user = req.user;

        // Respond with the cookies
        res.send(user)    
} catch (e) {
      // Handle errors during token verification
        return res.status(400).send({ error: "Invalid token", message: e.message });
    }
});

router.patch("/edit",userAuth,async(req,res)=>{
    try{
        if(!validateEditProfile(req)){
            throw new Error("Invalid body")
        }

        const user=req.user;
        Object.keys(req.body).forEach(key => (user[key] = req.body[key]))

        await user.save()

        res.status(200).send(({
            message:`${user.firstName}, your profile was update successfully`,
            data:user
        }))
    }catch(e){
        return res.status(400).send({  message: e.message });
    }
})


router.patch("/password", userAuth, async (req, res) => {
    try {
        const { password, newpassword } = req.body;
        const user = req.user; // Assuming userAuth middleware sets req.user

        // Validate current password
        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid current password." });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newpassword, 10);
        user.password = hashedNewPassword;

        // Save the updated user document
        await user.save();

        res.status(200).json({
            message: `${user.firstName}, your password was updated successfully`,
            data:user
        });
    } catch (e) {
        res.status(400).json({ message: `Error updating password: ${e.message}` });
    }
});



module.exports=router;
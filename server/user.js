const mongoose=require('mongoose');
const userSchema=new mongoose.Schema(
    {
        name:String,
        email:
        {
            type:String,
            required:true,
            lowercase:true,
            minlength:10,
            unique:true
        },
        password:String,
        createdAt:
        {
            type:Date,
            default:Date.now
        },
        lastlogin:Date
    }
);
module.exports=mongoose.model("User",userSchema)
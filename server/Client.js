const mongoose=require('mongoose');
const clientSchema=new mongoose.Schema(
    {
       consultantid:
        {
            type:mongoose.Schema.Types.ObjectId,
        },
        client_id:
        {
            type:mongoose.Schema.Types.ObjectId,
        },
        name:String,
        email:String,
        phone:String,
        occupation:String,
        lifestyle:String,
        gender:String,
        notes:String,
        createdAt:
        {
            type:Date,
            default:Date.now
        }
    }
);
module.exports=mongoose.model("Client",clientSchema)
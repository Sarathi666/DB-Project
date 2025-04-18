const mongoose=require('mongoose');
const ClientGoalsSchema=new mongoose.Schema(
    {
        client_id:mongoose.Schema.Types.ObjectId,
        primary_goal:String,
        secondary_goal:String,
        tertiary_goal:String,
        deadline : Date,
        updatedAt:
        {
            type:Date,
            default:Date.now
        }
    }
);
module.exports=mongoose.model("ClientGoals",ClientGoalsSchema)
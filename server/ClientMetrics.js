const mongoose=require('mongoose');
const ClientMetricsSchema=new mongoose.Schema(
    {
       client_id:mongoose.Schema.Types.ObjectId,
       age:Number,
       gender:String,
       height_cm:Number,
       weight_kg:Number,
       bmi:Number,
       fatpercent:Number,
       blood_sugar:Number,
       bp:String,
       cholesterol:Number,
       heart_rate:Number,
       sleep_hours:Number,
       activity_level:String,
       diet_preference:String,
       medical_conditions:[String],
       last_updated:
       {
        type:Date,
        default:Date.now,
       }
    }
);
module.exports=mongoose.model("ClientMetrics",ClientMetricsSchema)
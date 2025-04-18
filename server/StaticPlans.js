const mongoose=require('mongoose');
const WorkoutPlanSchema=new mongoose.Schema(
    {
       goal:String,
       condtion:String,
       metrics_range:Object,
       plan:Object
    }
);
const DietPlanSchema=new mongoose.Schema(
    {
       goal:String,
       condtion:String,
       diet_preference:String,
       macros:Object,
       guidelines:Object
    }
);
const WorkoutPlan = mongoose.model('WorkoutPlanSchema', WorkoutPlanSchema);
const DietPlan = mongoose.model('DietPlanSchema', DietPlanSchema);
module.exports={WorkoutPlan,DietPlan}
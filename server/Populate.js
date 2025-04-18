const mongoose = require('mongoose');
const Client = require('./Client');
const Goal = require('./ClientGoals');
const Metric = require('./ClientMetrics');
const WorkoutPlan = require('./StaticPlans').WorkoutPlan;
const DietPlan = require('./StaticPlans').DietPlan;
const consultant=require('./user');

mongoose.connect('mongodb://127.0.0.1:27017/DBMSPROJECT', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
});

const seed = async () => {
  try 
  {
    await Client.deleteMany({});
    await Goal.deleteMany({});
    await Metric.deleteMany({});
    await consultant.deleteMany({});
    

    const User = await consultant.create(
      {
        name: 'Will Smith',
        email: 'willsmith@example.com',
        password:'Willsmith@281205',
        createdAt: new Date('2025-04-14'),
        lastlogin: new Date('2025-01-01'),
      });
  
    await User.save()
    
    const client = await Client.create(
    {
      name: 'Alice Smith',
      age: 30,
      email: 'alice.smith@example.com',
      weight: 65,
      height: 165,
      bmi: 23.9,
      phone:'9944230050',
      occupation:'Doctor',
      lifestyle:'Rich',
      gender:'Male',
      notes:'Blah Blah Blah',
      createdAt:new Date('2025-04-14')
    });

    await client.save()


    const goal = await Goal.create(
    {
      client_id: client._id,
      primary_goal: 'Fat Loss',
      secondary_goal:'Six Pack',
      tertiary_goal:'Increse Stamina',
      deadline: new Date('2025-06-30'),
      updatedAt: new Date('2025-04-14'),
    });

    await goal.save()

    const metric = await Metric.create(
    {
      client_id: client._id,
      age:19,
      gender:'Male',
      height_cm:160,
      weight_kg:70,
      bmi:24,
      fatpercent:50,
      blood_sugar:100,
      bp:150,
      cholesterol:100,
      heart_rate:80,
      sleep_hours:7,
      activity_level:'Medium',
      diet_preference:'Non-Veg',
      medical_conditions:['Lean','Diabetic','Asthma'],
      last_updated: new Date('2025-04-14')
    });

    await metric.save()

    const workoutPlans = [
        {
          planName: "Fat Loss Beginner",
          level: "Beginner",
          gender: "Any",
          ageRange: "18-30",
          planDetails: "Cardio 5x/week, light weights, calorie deficit.",
          goal:"Fat Loss",
          condtion:"High Body fat",
          metrics_range:
          {
            "age":[25,40],
            "gender":"Male",
            "body_fat_percentage":[30,40],
            "blood_sugar":[100,125],
            "activity_level":"low",
            "medical_conditions":["Diabetics"]
          },
          plan:
          {
            "type":"Cardio_intensive",
            "days_per_week":5,
            "duration_per_session_min":45,
            "activities":["Walking","Cycling"],
            "progression":"Increase Intensity weekly",
            "notes":"Focus on Fat Burning"
          }
        }
      ];
  
      const dietPlans = [
        {
          planName: "Fat Loss Veg",
          goal: "Fat Loss",
          level: "Beginner",
          gender: "Female",
          ageRange: "18-35",
          planDetails: "Low-carb vegetarian meals.",
          condition:"High Body Fat",
          diet_preference:"Balanced",
          macros:
          {
            carbs_percent:40,
            protein_percent:30,
            fat_percent:30
          },
          guidelines:
          {
            sugar_intake:"Low"
          }
        }
      ];
      await WorkoutPlan.insertMany(workoutPlans);
      await DietPlan.insertMany(dietPlans);

    console.log('Seed data inserted successfully!');
  }
  catch (err)
  {
    console.error('Error inserting seed data:', err);
  }
  finally
  {
    mongoose.connection.close();
  }
};

seed();

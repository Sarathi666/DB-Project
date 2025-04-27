const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Workout Model
const WorkoutPlanSchema = new mongoose.Schema({
  title: String,
  goal: String, // e.g. "Weight Loss", "Muscle Gain"
  ageRange: String, // e.g. "18-25"
  gender: String,
  bodyFatRange: String, // e.g. "15-20%"
  activityLevel: String, // e.g. "Moderate"
  medicalConditionTags: [String], // e.g. ["hypertension", "asthma"]
  exercises: [String] // simplified for preloaded version
});
const WorkoutPlan = mongoose.model('WorkoutPlan', WorkoutPlanSchema);

//Diet Model
const DietPlanSchema = new mongoose.Schema({
  title: String,
  goal: String,
  ageRange: String,
  gender: String,
  bodyFatRange: String,
  bloodSugarLevel: String, // e.g. "Normal", "Pre-Diabetic"
  activityLevel: String,
  medicalConditionTags: [String],
  meals: [String], // simplified for preloaded version
  linkedWorkout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan'
  }
});
const DietPlan = mongoose.model('DietPlan', DietPlanSchema);

//seeding the database with workout and diet plans
const workoutPlans = [
  {
    title: "Beginner Fat Loss",
    goal: "Fat Loss",
    gender: "Any",
    ageRange: "18-30",
    activityLevel: "Low",
    bodyFatRange: "25-35%",
    medicalConditions: [],
    exercises: ["Jump rope", "Bodyweight squats", "Mountain climbers"],
  },
  {
    title: "Intermediate Weight Loss",
    goal: "Weight Loss",
    gender: "Any",
    ageRange: "20-35",
    activityLevel: "Medium",
    bodyFatRange: "15-25%",
    medicalConditions: [],
    exercises: ["Cardio intervals", "Strength training", "HIIT workouts"],
  },
  {
    title: "Advanced Weight Loss",
    goal: "Weight Loss",
    gender: "Any",
    ageRange: "25-40",
    activityLevel: "High",
    bodyFatRange: "20-30%",
    medicalConditions: [],
    exercises: ["Complex movements", "Circuit training", "Endurance exercises"],
  },
  {
    title: "Female Toning",
    goal: "Toning",
    gender: "Female",
    ageRange: "25-40",
    activityLevel: "Medium",
    bodyFatRange: "20-28%",
    medicalConditions: [],
    exercises: ["Pilates", "Lunges", "Kettlebell Swings"],
  },
  {
    title: "Senior Joint-Friendly",
    goal: "Mobility",
    gender: "Any",
    ageRange: "50+",
    activityLevel: "Low",
    bodyFatRange: "20-30%",
    medicalConditions: ["Joint Pain"],
    exercises: ["Water aerobics", "Chair yoga", "Stretching"],
  },
  // New workout plans
  {
    title: "Muscle Building Basics",
    goal: "Muscle Gain",
    gender: "Any",
    ageRange: "18-35",
    activityLevel: "Medium",
    bodyFatRange: "15-25%",
    medicalConditions: [],
    exercises: ["Push-ups", "Pull-ups", "Dumbbell rows", "Squats", "Deadlifts"],
  },
  {
    title: "Athletic Performance",
    goal: "Performance",
    gender: "Any",
    ageRange: "16-30",
    activityLevel: "High",
    bodyFatRange: "12-20%",
    medicalConditions: [],
    exercises: ["Plyometrics", "Agility drills", "Speed training", "Core workouts"],
  },
  {
    title: "Diabetes-Friendly Exercise",
    goal: "Weight Loss",
    gender: "Any",
    ageRange: "30-60",
    activityLevel: "Medium",
    bodyFatRange: "20-35%",
    medicalConditions: ["Diabetes"],
    exercises: ["Walking", "Swimming", "Light resistance training", "Balance exercises"],
  },
  {
    title: "Flexibility Focus",
    goal: "Mobility",
    gender: "Any",
    ageRange: "18-50",
    activityLevel: "Low",
    bodyFatRange: "15-30%",
    medicalConditions: [],
    exercises: ["Yoga", "Dynamic stretching", "Mobility drills", "Balance poses"],
  }
];

const dietPlans = [
  {
    title: "Low Carb Fat Loss",
    goal: "Fat Loss",
    gender: "Any",
    ageRange: "18-30",
    bodyFatRange: "25-35%",
    bloodSugarLevel: "Normal",
    activityLevel: "Low",
    medicalConditions: [],
    meals: ["Grilled chicken salad", "Boiled eggs", "Steamed broccoli"],
    linkedWorkoutTitle: "Beginner Fat Loss",
  },
  {
    title: "Balanced Weight Loss",
    goal: "Weight Loss",
    gender: "Any",
    ageRange: "20-35",
    bodyFatRange: "15-25%",
    bloodSugarLevel: "Normal",
    activityLevel: "Medium",
    medicalConditions: [],
    meals: ["Lean protein", "Complex carbs", "Healthy fats"],
    linkedWorkoutTitle: "Intermediate Weight Loss",
  },
  {
    title: "High Protein Weight Loss",
    goal: "Weight Loss",
    gender: "Any",
    ageRange: "25-40",
    bodyFatRange: "20-30%",
    bloodSugarLevel: "Normal",
    activityLevel: "High",
    medicalConditions: [],
    meals: ["Protein shakes", "Grilled fish", "Vegetables"],
    linkedWorkoutTitle: "Advanced Weight Loss",
  },
  {
    title: "Toning Plan for Women",
    goal: "Toning",
    gender: "Female",
    ageRange: "25-40",
    bodyFatRange: "20-28%",
    bloodSugarLevel: "Normal",
    activityLevel: "Medium",
    medicalConditions: [],
    meals: ["Quinoa bowl", "Grilled tofu", "Fruit salad"],
    linkedWorkoutTitle: "Female Toning",
  },
  {
    title: "Senior Balanced Diet",
    goal: "Mobility",
    gender: "Any",
    ageRange: "50+",
    bodyFatRange: "20-30%",
    bloodSugarLevel: "Normal",
    activityLevel: "Low",
    medicalConditions: ["Joint Pain"],
    meals: ["Oatmeal", "Steamed fish", "Vegetable soup"],
    linkedWorkoutTitle: "Senior Joint-Friendly",
  },
  // New diet plans
  {
    title: "Muscle Building Nutrition",
    goal: "Muscle Gain",
    gender: "Any",
    ageRange: "18-35",
    bodyFatRange: "15-25%",
    bloodSugarLevel: "Normal",
    activityLevel: "Medium",
    medicalConditions: [],
    meals: ["Protein-rich breakfast", "Pre-workout snack", "Post-workout meal", "Evening protein"],
    linkedWorkoutTitle: "Muscle Building Basics",
  },
  {
    title: "Athletic Performance Diet",
    goal: "Performance",
    gender: "Any",
    ageRange: "16-30",
    bodyFatRange: "12-20%",
    bloodSugarLevel: "Normal",
    activityLevel: "High",
    medicalConditions: [],
    meals: ["Energy-dense breakfast", "Sports nutrition", "Recovery meals", "Hydration focus"],
    linkedWorkoutTitle: "Athletic Performance",
  },
  {
    title: "Diabetes Management Diet",
    goal: "Weight Loss",
    gender: "Any",
    ageRange: "30-60",
    bodyFatRange: "20-35%",
    bloodSugarLevel: "High",
    activityLevel: "Medium",
    medicalConditions: ["Diabetes"],
    meals: ["Low glycemic foods", "Balanced meals", "Regular snacks", "Blood sugar monitoring"],
    linkedWorkoutTitle: "Diabetes-Friendly Exercise",
  },
  {
    title: "Flexibility & Wellness Diet",
    goal: "Mobility",
    gender: "Any",
    ageRange: "18-50",
    bodyFatRange: "15-30%",
    bloodSugarLevel: "Normal",
    activityLevel: "Low",
    medicalConditions: [],
    meals: ["Anti-inflammatory foods", "Hydration focus", "Balanced nutrients", "Wellness foods"],
    linkedWorkoutTitle: "Flexibility Focus",
  }
];
const seedPlans = async () => {
  try {
    console.log('🌱 Starting seeding process...');

    await WorkoutPlan.deleteMany({});
    await DietPlan.deleteMany({});

    const savedWorkoutPlans = await WorkoutPlan.insertMany(workoutPlans);
    console.log('✅ Workout Plans Seeded');

    const workoutTitleMap = {};
    savedWorkoutPlans.forEach(w => {
      workoutTitleMap[w.title] = w._id;
    });

    const linkedDietPlans = dietPlans.map(diet => ({
      ...diet,
      linkedWorkout: workoutTitleMap[diet.linkedWorkoutTitle]
    }));

    await DietPlan.insertMany(linkedDietPlans);
    console.log('✅ Diet Plans Seeded');
  } catch (err) {
    console.error('❌ Error during seeding:', err);
  }
};

// Migration function to update existing clients
async function migrateClients() {
  try {
    console.log('Starting client migration...');
    
    // Temporarily modify the Client schema to accept string for createdBy
    Client.schema.path('createdBy').options.type = mongoose.Schema.Types.Mixed;
    
    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    // For each user, update their clients
    for (const user of users) {
      // Find all clients created by this user's email
      const clients = await Client.find({ createdBy: user.email });
      console.log(`Found ${clients.length} clients for user ${user.email}`);

      // Update each client to use the user's ID
      for (const client of clients) {
        await Client.updateOne(
          { _id: client._id },
          { $set: { createdBy: user._id } }
        );
        console.log(`Updated client ${client._id} for user ${user.email}`);
      }
    }

    // Restore the original schema type
    Client.schema.path('createdBy').options.type = mongoose.Schema.Types.ObjectId;

    console.log('Client migration completed successfully');
  } catch (err) {
    console.error('Error during client migration:', err);
  }
}

// Update the MongoDB connection to run migration
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');

    const existing = await WorkoutPlan.find();
    if (existing.length === 0) {
      await seedPlans();
    } else {
      console.log('⚠️ Workout and Diet plans already seeded. Skipping...');
    }

    // Run the migration
    await migrateClients();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// User Model
const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

// models/Client.js

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  goals: { type: [String], required: true },
  bodyFat: { type: Number, required: true },
  bloodSugar: { type: Number, required: true },
  bloodSugarLevel: { type: String, enum: ["Low", "Normal", "High"], default: "Normal" },
  activityLevel: { type: String, required: true },
  medicalConditions: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  consultantEmail: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.Mixed },
  matchedWorkoutPlan: { type: String },
  matchedDietPlan: { type: String },
}, { timestamps: true });

const Client = mongoose.model('Client', ClientSchema);

function mapBloodSugar(bloodSugarValue) {
  if (bloodSugarValue >= 70 && bloodSugarValue <= 99) {
    return "Normal";
  } else if (bloodSugarValue < 70) {
    return "Low";
  } else if (bloodSugarValue >= 100) {
    return "High";
  } else {
    return "Normal"; // Default to Normal if value is invalid
  }
}

function mapActivityLevel(level) {
  const mapping = {
    'Sedentary': 'Low',
    'Lightly Active': 'Low',
    'Moderately Active': 'Medium',
    'Very Active': 'High',
    'Extra Active': 'High'
  };
  console.log('Mapping activity level:', { input: level, mapped: mapping[level] || 'Low' });
  return mapping[level] || 'Low';
}

function isBodyFatInRange(bodyFat, range) {
  // Remove '%' symbol and split into min and max
  const [min, max] = range.replace('%', '').split('-').map(Number);
  console.log('Body fat check:', { bodyFat, range, min, max, result: bodyFat >= min && bodyFat <= max });
  return bodyFat >= min && bodyFat <= max;
}

function matchWorkoutAndDiet(clientInput) {
  const {
    age,
    gender,
    goal,
    bodyFat,
    bloodSugar,
    activityLevel,
    medicalConditions = [],
  } = clientInput;

  console.log('=== MATCHING DEBUG ===');
  console.log('Input values:', {
    age,
    gender,
    goal,
    bodyFat,
    bloodSugar,
    activityLevel,
    medicalConditions
  });

  function isAgeInRange(age, range) {
    if (!range) return false;
    if (range.includes('+')) {
      const min = parseInt(range);
      return age >= min;
    } else {
      const [min, max] = range.split('-').map(Number);
      return age >= min && age <= max;
    }
  }

  function isBodyFatInRange(bodyFat, range) {
    if (!range) return false;
    const [min, max] = range.replace('%', '').split('-').map(Number);
    return bodyFat >= min && bodyFat <= max;
  }

  function calculateWorkoutScore(plan) {
    let score = 0;
    
    // Goal match (highest priority)
    if (plan.goal === goal || 
        (plan.goal === "Fat Loss" && goal === "Weight Loss") || 
        (plan.goal === "Weight Loss" && goal === "Fat Loss")) {
      score += 3;
    }
    
    // Gender match
    if (plan.gender === "Any" || plan.gender === gender) {
      score += 2;
    }
    
    // Age match
    if (isAgeInRange(age, plan.ageRange)) {
      score += 2;
    }
    
    // Body fat match
    if (isBodyFatInRange(bodyFat, plan.bodyFatRange)) {
      score += 2;
    }
    
    // Activity level match
    if (mapActivityLevel(activityLevel) === plan.activityLevel) {
      score += 2;
    }
    
    // Medical conditions match
    if (!plan.medicalConditions || plan.medicalConditions.length === 0 || 
        !medicalConditions || medicalConditions.length === 0 ||
        plan.medicalConditions.every(mc => medicalConditions.includes(mc))) {
      score += 1;
    }
    
    return score;
  }

  function calculateDietScore(plan) {
    let score = 0;
    
    // Goal match (highest priority)
    if (plan.goal === goal || 
        (plan.goal === "Fat Loss" && goal === "Weight Loss") || 
        (plan.goal === "Weight Loss" && goal === "Fat Loss")) {
      score += 3;
    }
    
    // Gender match
    if (plan.gender === "Any" || plan.gender === gender) {
      score += 2;
    }
    
    // Age match
    if (isAgeInRange(age, plan.ageRange)) {
      score += 2;
    }
    
    // Body fat match
    if (isBodyFatInRange(bodyFat, plan.bodyFatRange)) {
      score += 2;
    }
    
    // Blood sugar match
    if (mapBloodSugar(bloodSugar) === plan.bloodSugarLevel) {
      score += 2;
    }
    
    // Activity level match
    if (mapActivityLevel(activityLevel) === plan.activityLevel) {
      score += 2;
    }
    
    // Medical conditions match
    if (!plan.medicalConditions || plan.medicalConditions.length === 0 || 
        !medicalConditions || medicalConditions.length === 0 ||
        plan.medicalConditions.every(mc => medicalConditions.includes(mc))) {
      score += 1;
    }
    
    return score;
  }

  // Find best matching workout plan
  let bestWorkoutScore = -1;
  let bestWorkoutPlan = null;
  
  workoutPlans.forEach(plan => {
    const score = calculateWorkoutScore(plan);
    console.log(`Workout plan ${plan.title} score:`, score);
    if (score > bestWorkoutScore) {
      bestWorkoutScore = score;
      bestWorkoutPlan = plan;
    }
  });

  // Find best matching diet plan
  let bestDietScore = -1;
  let bestDietPlan = null;
  
  dietPlans.forEach(plan => {
    const score = calculateDietScore(plan);
    console.log(`Diet plan ${plan.title} score:`, score);
    if (score > bestDietScore) {
      bestDietScore = score;
      bestDietPlan = plan;
    }
  });

  const result = {
    workoutPlan: bestWorkoutPlan ? bestWorkoutPlan.title : null,
    dietPlan: bestDietPlan ? bestDietPlan.title : null,
  };

  console.log('\nFinal match result:', result);
  console.log('=== END MATCHING DEBUG ===\n');
  return result;
}


const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token'); // Ensure this is where you're sending the token from frontend
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = decoded.user; // decoded.user should have email
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};



// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log("Received registration data:", req.body); // Log the incoming data
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists'); // Log if email already exists
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      console.log("User registered successfully");
      res.json({ token });
    });
  } catch (err) {
    console.error(err);  // Log errors
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { 
      user: { 
        id: user.id, 
        email: user.email // ✅ include email too
      }
    };
    

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;

      res.json({
        token,
        user: {
          id: user.id, // ✅ Include this so you can use it when adding/fetching clients
          name: user.name,
          email: user.email
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});


// Delete Account Route
app.delete('/api/auth/delete', authMiddleware, async (req, res) => {
  try {
    // First, delete all clients created by this user
    await Client.deleteMany({ createdBy: req.user.id });
    console.log(`Deleted all clients for user ID: ${req.user.id}`);

    // Then delete the user account
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log(`Account deleted successfully for user: ${user.name} (ID: ${user._id})`);
    res.json({ msg: 'Account and associated clients deleted successfully' });
  } catch (err) {
    console.error('Error deleting account and clients:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.get('/api/auth/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user); // Send user data back
  } catch (err) {
    console.error('Error in GET /api/auth/user:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

//Client Routes

// Create a new client
app.post('/api/clients', authMiddleware, async (req, res) => {
  try {
    const clientInput = req.body;
    console.log('Received client input:', JSON.stringify(clientInput, null, 2));

    // Ensure goals is always an array
    const goals = Array.isArray(clientInput.goals) ? clientInput.goals : [clientInput.goals];
    
    // Convert numeric values
    const age = parseInt(clientInput.age, 10);
    const bodyFat = parseFloat(clientInput.bodyFat);
    const bloodSugar = parseFloat(clientInput.bloodSugar);
    
    // Validate numeric values
    if (isNaN(age) || isNaN(bodyFat) || isNaN(bloodSugar)) {
      console.error('Invalid numeric values:', { age, bodyFat, bloodSugar });
      return res.status(400).json({ 
        msg: "Invalid numeric values", 
        details: { age, bodyFat, bloodSugar } 
      });
    }

    // Ensure medicalConditions is a string
    let medicalConditions = '';
    if (clientInput.medicalConditions !== undefined && clientInput.medicalConditions !== null) {
      medicalConditions = String(clientInput.medicalConditions);
    }

    // Get matched plans
    const matchedPlans = matchWorkoutAndDiet({
      age,
      gender: clientInput.gender,
      goal: goals[0], // Using first goal for matching
      bodyFat,
      bloodSugar: mapBloodSugar(bloodSugar),
      activityLevel: mapActivityLevel(clientInput.activityLevel),
      medicalConditions: medicalConditions ? medicalConditions.split(',').map(mc => mc.trim()) : []
    });

    // Find the full plan details
    const workoutPlanDetails = workoutPlans.find(plan => plan.title === matchedPlans.workoutPlan);
    const dietPlanDetails = dietPlans.find(plan => plan.title === matchedPlans.dietPlan);

    const newClient = new Client({
      name: clientInput.name,
      email: clientInput.email,
      age: age,
      gender: clientInput.gender,
      goals: goals,
      bodyFat: bodyFat,
      bloodSugar: bloodSugar,
      bloodSugarLevel: mapBloodSugar(bloodSugar),
      activityLevel: mapActivityLevel(clientInput.activityLevel),
      medicalConditions: medicalConditions,
      consultantEmail: clientInput.consultantEmail,
      createdBy: req.user.id,
      matchedWorkoutPlan: matchedPlans.workoutPlan,
      matchedDietPlan: matchedPlans.dietPlan
    });

    console.log('Attempting to save client with data:', JSON.stringify(newClient, null, 2));
    
    const saved = await newClient.save();
    console.log('Saved client:', JSON.stringify(saved, null, 2));

    // Return the saved client with full plan details
    const response = {
      ...saved.toObject(),
      matchedWorkoutPlan: workoutPlanDetails,
      matchedDietPlan: dietPlanDetails
    };

    res.status(201).json(response);

  } catch (err) {
    console.error("Client creation error:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        msg: "Validation error",
        details: err.errors
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({
        msg: "Duplicate key error",
        details: "A client with this email already exists"
      });
    }
    
    res.status(500).json({ 
      msg: "Server Error", 
      error: err.message,
      details: err.errors
    });
  }
});




// Fetch all clients for a specific consultant
app.get('/api/clients', authMiddleware, async (req, res) => {
  const { email } = req.query;

  try {
    const clients = await Client.find({ consultantEmail: email });
    
    // Add matched plans to each client
    const clientsWithPlans = clients.map(client => {
      const matchedPlans = matchWorkoutAndDiet({
        age: client.age,
        gender: client.gender,
        goal: client.goals[0],
        bodyFat: client.bodyFat,
        bloodSugar: client.bloodSugar,
        activityLevel: client.activityLevel,
        medicalConditions: client.medicalConditions ? client.medicalConditions.split(',').map(mc => mc.trim()) : []
      });
      
      const workoutPlanDetails = workoutPlans.find(plan => plan.title === matchedPlans.workoutPlan);
      const dietPlanDetails = dietPlans.find(plan => plan.title === matchedPlans.dietPlan);
      
      return {
        ...client.toObject(),
        matchedWorkoutPlan: workoutPlanDetails || null,
        matchedDietPlan: dietPlanDetails || null
      };
    });
    
    res.json(clientsWithPlans);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.put('/api/clients/:id', authMiddleware, async (req, res) => {
  try {
    const clientInput = req.body;
    console.log('Received client update input:', JSON.stringify(clientInput, null, 2));

    // First, get the existing client
    const existingClient = await Client.findOne({ _id: req.params.id, consultantEmail: req.user.email });
    if (!existingClient) {
      console.log('No matching client found!');
      return res.status(404).json({ msg: 'Client not found' });
    }

    // Merge the existing client data with the updates
    const updatedData = {
      ...existingClient.toObject(),
      ...clientInput,
      // Ensure numeric fields are properly converted
      age: clientInput.age ? parseInt(clientInput.age, 10) : existingClient.age,
      bodyFat: clientInput.bodyFat ? parseFloat(clientInput.bodyFat) : existingClient.bodyFat,
      bloodSugar: clientInput.bloodSugar ? parseFloat(clientInput.bloodSugar) : existingClient.bloodSugar,
      // Ensure goals is always an array
      goals: Array.isArray(clientInput.goals) ? clientInput.goals : 
             clientInput.goals ? [clientInput.goals] : 
             existingClient.goals
    };

    // Validate numeric values
    if (isNaN(updatedData.age) || isNaN(updatedData.bodyFat) || isNaN(updatedData.bloodSugar)) {
      console.error('Invalid numeric values:', { 
        age: updatedData.age, 
        bodyFat: updatedData.bodyFat, 
        bloodSugar: updatedData.bloodSugar 
      });
      return res.status(400).json({ 
        msg: "Invalid numeric values", 
        details: { 
          age: updatedData.age, 
          bodyFat: updatedData.bodyFat, 
          bloodSugar: updatedData.bloodSugar 
        } 
      });
    }

    // Get matched plans
    const matchedPlans = matchWorkoutAndDiet({
      age: updatedData.age,
      gender: updatedData.gender,
      goal: updatedData.goals[0], // Using first goal for matching
      bodyFat: updatedData.bodyFat,
      bloodSugar: mapBloodSugar(updatedData.bloodSugar),
      activityLevel: mapActivityLevel(updatedData.activityLevel),
      medicalConditions: updatedData.medicalConditions ? updatedData.medicalConditions.split(',').map(mc => mc.trim()) : []
    });

    // Find the full plan details
    const workoutPlanDetails = workoutPlans.find(plan => plan.title === matchedPlans.workoutPlan);
    const dietPlanDetails = dietPlans.find(plan => plan.title === matchedPlans.dietPlan);

    // Update the client with all fields
    const updatedClient = await Client.findOneAndUpdate(
      { _id: req.params.id, consultantEmail: req.user.email },
      { 
        ...updatedData,
        matchedWorkoutPlan: matchedPlans.workoutPlan, // Store only the title
        matchedDietPlan: matchedPlans.dietPlan, // Store only the title
        createdBy: req.user.id
      },
      { new: true }
    );

    // Return the updated client with full plan details
    const response = {
      ...updatedClient.toObject(),
      matchedWorkoutPlan: workoutPlanDetails,
      matchedDietPlan: dietPlanDetails
    };

    console.log('Updated client:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (err) {
    console.error('Client update error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// DELETE client
app.delete('/api/clients/:id', authMiddleware, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, consultantEmail: req.user.email });
    
    if (!client) {
      return res.status(404).json({ msg: 'Client not found' });
    }

    res.json({ msg: 'Client deleted' });
  } catch (err) {
    console.error('Client deletion error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Add this new endpoint before the client routes
app.post('/api/match', authMiddleware, async (req, res) => {
  try {
    const clientInput = req.body;
    console.log('Received match request:', JSON.stringify(clientInput, null, 2));

    // Ensure goals is always an array
    const goals = Array.isArray(clientInput.goals) ? clientInput.goals : [clientInput.goals];
    
    // Convert numeric values
    const age = parseInt(clientInput.age, 10);
    const bodyFat = parseFloat(clientInput.bodyFat);
    const bloodSugar = parseFloat(clientInput.bloodSugar);
    
    // Validate numeric values
    if (isNaN(age) || isNaN(bodyFat) || isNaN(bloodSugar)) {
      console.error('Invalid numeric values:', { age, bodyFat, bloodSugar });
      return res.status(400).json({ 
        msg: "Invalid numeric values", 
        details: { age, bodyFat, bloodSugar } 
      });
    }

    // Ensure medicalConditions is a string
    let medicalConditions = '';
    if (clientInput.medicalConditions !== undefined && clientInput.medicalConditions !== null) {
      medicalConditions = String(clientInput.medicalConditions);
    }

    // Get matched plans
    const matchedPlans = matchWorkoutAndDiet({
      age,
      gender: clientInput.gender,
      goal: goals[0], // Using first goal for matching
      bodyFat,
      bloodSugar: mapBloodSugar(bloodSugar),
      activityLevel: mapActivityLevel(clientInput.activityLevel),
      medicalConditions: medicalConditions ? medicalConditions.split(',').map(mc => mc.trim()) : []
    });

    res.json(matchedPlans);
  } catch (err) {
    console.error("Matchmaking error:", err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

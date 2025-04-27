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
    title: "Intermediate Muscle Gain",
    goal: "Muscle Gain",
    gender: "Male",
    ageRange: "20-35",
    activityLevel: "Medium",
    bodyFatRange: "15-20%",
    medicalConditions: [],
    exercises: ["Deadlifts", "Barbell Rows", "Pull-ups"],
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
  {
    title: "Athletic Conditioning",
    goal: "Performance",
    gender: "Any",
    ageRange: "18-40",
    activityLevel: "High",
    bodyFatRange: "10-15%",
    medicalConditions: [],
    exercises: ["Sled pushes", "Sprints", "Box jumps"],
  },
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
    title: "High Protein Muscle Gain",
    goal: "Muscle Gain",
    gender: "Male",
    ageRange: "20-35",
    bodyFatRange: "15-20%",
    bloodSugarLevel: "Normal",
    activityLevel: "Medium",
    medicalConditions: [],
    meals: ["Beef steak", "Brown rice", "Protein smoothie"],
    linkedWorkoutTitle: "Intermediate Muscle Gain",
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
  {
    title: "Athletic High-Calorie",
    goal: "Performance",
    gender: "Any",
    ageRange: "18-40",
    bodyFatRange: "10-15%",
    bloodSugarLevel: "Normal",
    activityLevel: "High",
    medicalConditions: [],
    meals: ["Chicken pasta", "Greek yogurt", "Banana smoothie"],
    linkedWorkoutTitle: "Athletic Conditioning",
  },
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

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');

    const existing = await WorkoutPlan.find();
    if (existing.length === 0) {
      await seedPlans();
    } else {
      console.log('⚠️ Workout and Diet plans already seeded. Skipping...');
    }
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
 
  bloodSugar: { type: Number, required: true }, // keep the original blood sugar number (ex: 90)

bloodSugarLevel: { type: String, enum: ["Low", "Normal", "High"], default: "Normal" }, // new field for mapped value

  activityLevel: { type: String, required: true },
  medicalConditions: { type: String },
  email: { type: String, required: true, unique: true }, // unique client email
  consultantEmail: { type: String, required: true },     // the consultant's email
  createdBy: { type: String, required: true },
  workoutPlan: { type: String },  // the matched workout title
  dietPlan: { type: String },     // the matched diet title

}, { timestamps: true });  // optional: createdAt, updatedAt


const Client = mongoose.model('Client', ClientSchema);

function mapBloodSugar(bloodSugarValue) {
  if (bloodSugarValue >= 70 && bloodSugarValue <= 99) {
    return "Normal";
  } else if (bloodSugarValue < 70) {
    return "Low";
  } else if (bloodSugarValue >= 100) {
    return "High";
  } else {
    return "Unknown";
  }
}

function mapActivityLevel(formValue) {
  switch (formValue) {
    case "Sedentary":
      return "Low";
    case "Lightly Active":
    case "Moderately Active":
      return "Medium";
    case "Very Active":
    case "Extra Active":
      return "High";
    default:
      return "Medium"; // default fallback
  }
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

  function isAgeInRange(age, range) {
    if (range.includes('+')) {
      const min = parseInt(range);
      return age >= min;
    } else {
      const [min, max] = range.split('-').map(Number);
      return age >= min && age <= max;
    }
  }

  function isBodyFatInRange(bodyFat, range) {
    const [min, max] = range.split('-').map(Number);
    return bodyFat >= min && bodyFat <= max;
  }

  const matchedWorkout = workoutPlans.find(plan =>
    (plan.gender === "Any" || plan.gender === gender) &&
    plan.goal === goal &&
    isAgeInRange(age, plan.ageRange) &&
    isBodyFatInRange(bodyFat, plan.bodyFatRange) &&
    plan.activityLevel === activityLevel &&
    (plan.medicalConditions.length === 0 || plan.medicalConditions.every(mc => medicalConditions.includes(mc)))
  );

  const matchedDiet = dietPlans.find(plan =>
    (plan.gender === "Any" || plan.gender === gender) &&
    plan.goal === goal &&
    isAgeInRange(age, plan.ageRange) &&
    isBodyFatInRange(bodyFat, plan.bodyFatRange) &&
    plan.bloodSugarLevel === bloodSugar &&
    plan.activityLevel === activityLevel &&
    (plan.medicalConditions.length === 0 || plan.medicalConditions.every(mc => medicalConditions.includes(mc)))
  );

  return {
    workoutPlan: matchedWorkout ? matchedWorkout.title : null,
    dietPlan: matchedDiet ? matchedDiet.title : null,
  };
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
 
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log(`Attempting to delete account for user: ${user.name} (ID: ${user._id})`);
    console.log(`Account deleted successfully`);
    res.json({ msg: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
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

    const normalizedInput = {
      ...clientInput,
      goal: Array.isArray(clientInput.goals) ? clientInput.goals[0] : clientInput.goal,
      bloodSugar: mapBloodSugar(Number(clientInput.bloodSugar)), // normalized blood sugar
      activityLevel: mapActivityLevel(clientInput.activityLevel), // normalized activity level
    };

    const matchedPlans = matchWorkoutAndDiet(normalizedInput);

    const newClient = new Client({
      name: clientInput.name,
      email: clientInput.email,
      age: clientInput.age,
      gender: clientInput.gender,
      goal: normalizedInput.goal,
      bodyFat: clientInput.bodyFat,
      bloodSugar: clientInput.bloodSugar, // Keep number if schema expects number
      bloodSugarLevel: normalizedInput.bloodSugar, // add normalized blood sugar
      activityLevel: normalizedInput.activityLevel,
      medicalConditions: clientInput.medicalConditions || [],
      workoutPlan: matchedPlans.workoutPlan,
      dietPlan: matchedPlans.dietPlan,
      createdBy: req.user.email,
      consultantEmail: req.user.email, // ✅ ADD THIS LINE
    });

    const saved = await newClient.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error("Client creation error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});




// Fetch all clients for a specific consultant
app.get('/api/clients', authMiddleware, async (req, res) => {
  const { email } = req.query; // get consultant's email

  try {
    const clients = await Client.find({ consultantEmail: email });
    res.json(clients);
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

app.put('/api/clients/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Received PUT request for ID:', req.params.id);
    console.log('Authenticated user email:', req.user.email);

    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, consultantEmail: req.user.email },
      { ...req.body, createdBy: req.user.email }, // Add createdBy field
     
      { new: true }
    );

    if (!client) {
      console.log('No matching client found!');
      return res.status(404).json({ msg: 'Client not found' });
    }

    res.json(client);
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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require('express');
// const mongoose = require('mongoose');
// const getPlanRoute = require('./getPlan'); 

// const app = express();
// const PORT = 3000;

// mongoose.connect('mongodb://127.0.0.1:27017/DBMSPROJECT')
//   .then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error('MongoDB Error:', err));

// app.use('/', getPlanRoute);  
// app.get('/',)

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const {MongoClient}=require('mongodb');
const express=require('express');
const app=express();
const cors =require('cors');
app.use(cors("*"));
const matchPlans = require('./Matching');

app.get('/getdiet',async (req,res)=>
{
  const client=new MongoClient('mongodb://localhost')
  const db=client.db('DBMSPROJECT');
  const coll=db.collection('dietplanschemas')
  const cursor=await coll.find({}).toArray();
  console.log(cursor);
  res.json(cursor);
})

app.get('/getwork',async (req,res)=>
  {
    const client=new MongoClient('mongodb://localhost')
    const db=client.db('DBMSPROJECT');
    const coll=db.collection('workoutplanschemas')
    const cursor=await coll.find({}).toArray();
    console.log(cursor);
    res.json(cursor);
  })

  // app.get('/getplan/:clientId', async (req, res) =>
  // {
  //   const clientId = req.params.clientId;
  //   const plans = await matchPlans(clientId);
  //   if (!plans.workoutPlan || !plans.dietPlan)
  //   {
  //     return res.status(404).json({ message: "No matching plan found" });
  //   }
  //   res.json(plans);
  // });
  app.listen(8000,()=>console.log('Running on port 8000'))

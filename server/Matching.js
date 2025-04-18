const mongoose = require('mongoose');
const ClientInfo = require('./Client');
const ClientGoals = require('./ClientGoals');
const ClientMetrics = require('./ClientMetrics');
const { WorkoutPlan, DietPlan } = require('./StaticPlans');

async function matchPlans(clientId)
{
  console.log('hello')
  const ObjectId = mongoose.Types.ObjectId;
  const info = await ClientInfo.find({_id : {$in : [clientId]}});
  const goals = await ClientGoals.find({client_id : {$in : [clientId]}});
  const metrics = await ClientMetrics.find({client_id: {$in : [clientId]}});
  console.log({info, goals, metrics})
  // const info = await ClientInfo.findById(clientId);
  // const goals = await ClientGoals.findById(clientId );
  // const metrics = await ClientMetrics.findById( clientId );

  // if (!info || !goals || !metrics) {
  //   throw new Error('Missing client records');
  // }

  const workoutPlan = await WorkoutPlan.findOne({
    goal : goals[0].primary_goal
  });
  console.log(goals.primary_goal)
  const dietPlan = await DietPlan.findOne({
    goal : goals[0].primary_goal

  });

  return { workoutPlan, dietPlan };
}

module.exports = matchPlans;

mongoose.connect('mongodb://127.0.0.1:27017/DBMSPROJECT')
  .then(async () => {
    const cId = '6801021f129a128e48488548';
    const result = await matchPlans(cId);
    console.log('Matched Plans:', result);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
  });

// mongoose.connect('mongodb://127.0.0.1:27017/DBMSPROJECT')
//   .then(async () => {
//     const clients = await ClientInfo.find({});
//     console.log(clients);
//     mongoose.connection.close();
//   });


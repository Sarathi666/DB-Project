const express = require('express');
const router = express.Router();
const matchPlans = require('./Matching'); 

router.get('/get-plan/:clientId', async (req, res) => {
    try
    {
        const clientId = req.params.clientId;
        const plans = await matchPlans(clientId);
        console.log(plans);

        if (!plans.workoutPlan || !plans.dietPlan)
        {
        return res.status(404).json({ message: "No matching plan found" });
        }

        res.json(plans);
    }
    catch (error)
    {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

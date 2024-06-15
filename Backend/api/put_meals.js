const checkuser = require('../utils/checkuser.js')
const { mealssq } = require('../models.js')

async function meals(req, res) {
    const { month, year, sessionid, kitchenid } = req.body;
    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      res.status(403).json({ error: 'No Permision' });
      return;
    }
  
    try {
        // Query the database to retrieve meals for the specified month and year
        const meals = await mealssq.findAll({
          where: {
            kitchen_id: kitchenid,
            month:month,
            year:year
          }
        });
  
        res.json(meals); // Send the retrieved meals as JSON response
    } catch (error) {
        console.error('Error retrieving meals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = meals;
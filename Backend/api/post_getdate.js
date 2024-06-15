const checkuser = require('../utils/checkuser.js')
const { mealssq } = require('../models.js')

async function getdate(req, res) {
    const { day, month, year, sessionid, kitchenid } = req.body;
    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
        return res.status(403).json({ error: 'No Permision' }); 
    }
  
    try {
        // Query the database to retrieve meals for the specified month and year
        const meal = await mealssq.findOne({
          where: {
            kitchen_id: kitchenid,
            month:month,
            year:year,
            day:day
          }
        });
  
        if (!meal) {
          return res.status(200).json({});
        }

        res.json(meal).status(200); // Send the retrieved meals as JSON response
    } catch (error) {
        console.error('Error retrieving meals:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = getdate;
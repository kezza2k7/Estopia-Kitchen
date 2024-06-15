const { kitchentranssq, Users } = require('../models.js')

async function requestfirstkitchen(req, res) {
    const { sessionid } = req.body;

    try {
        // Query the database to retrieve meals for the specified month and year
        const user = await Users.findOne({
          where: {
            sessionid: sessionid
          }
        });
  
        if(!user){
          res.status(403).json({ error: 'No Account' });
          return
        }
  
        const kitchens = await kitchentranssq.findOne({
            where: {
              user_id: user.id
            }
        });
  
        res.json(kitchens.kitchen_id)
    } catch (error) {
        console.error('Error retrieving kitchen:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = requestfirstkitchen;
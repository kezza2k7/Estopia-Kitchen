const { Users, kitchensq, kitchentranssq } = require('../models.js')

async function makekitchen(req, res) {
    const { sessionid, kitchenname } = req.body;

    const user = await Users.findOne({
      where: {
        sessionid: sessionid
      }
    });
  
    if(!user){
      res.status(403).json({ error: 'No Permision' });
      return
    }
  
    try {
      const kitchen = await kitchensq.create({ kitchen_name: kitchenname , kitchen_owner: user.id });
      const kitchentran = await kitchentranssq.create({ kitchen_id: kitchen.kitchen_id , user_id: user.id });
      res.status(201).json([kitchentran, kitchen]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = makekitchen;
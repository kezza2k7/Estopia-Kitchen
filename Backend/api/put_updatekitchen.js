const checkuser = require('../utils/checkuser.js')
const { Users, kitchensq } = require('../models.js')

async function updateKitchen(req, res) {
    const { sessionid, kitchenname, kitchenid } = req.body;
  
    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      res.status(403).json({ error: 'Not in it' });
      return;
    }
  
    try {
      const user = await Users.findOne({ where: { sessionid: sessionid } });
    
      if (user) {
          const Kitchen = await kitchensq.findByPk(kitchenid);
  
          if (Kitchen.kitchen_owner == user.id) {
            Kitchen.kitchen_name = kitchenname
            Kitchen.save()
            res.status(200).json("Changed to:")
          } else {
            res.status(403).json({ error: 'Not Owner' });
          }
          
      } else {
        res.status(403).json({ error: 'Not a player' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = updateKitchen;
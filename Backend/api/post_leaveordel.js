const { Users, kitchensq, kitchentranssq, Item, Shopping, InviteLinks, mealssq } = require('../models.js')
const checkuser = require('../utils/checkuser.js')

async function leaveordel(req, res) {
    const { kitchenid, sessionid } = req.body;

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
              await kitchentranssq.destroy({
                where: {
                  kitchen_id: kitchenid,
                },
              });
              await Item.destroy({
                where: {
                  kitchen: kitchenid,
                },
              });
              await Shopping.destroy({
                where: {
                  kitchen: kitchenid,
                },
              });
              await InviteLinks.destroy({
                where: {
                  kitchenid: kitchenid,
                },
              });
              await mealssq.destroy({
                where: {
                  kitchen_id: kitchenid,
                },
              });
            await Kitchen.destroy()
          } else {
            const KitchenCon = await kitchentranssq.findOne({ where: { user_id: user.id, kitchen_id: kitchenid }});
  
            await KitchenCon.destroy()
          }
          res.status(200).json("Destroyed or Left")
      } else {
        res.status(403).json({ error: 'Not a player' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = leaveordel;
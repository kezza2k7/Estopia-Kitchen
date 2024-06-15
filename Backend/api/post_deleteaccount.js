const {
    Users,
    Item,
    Shopping,
    mealssq,
    kitchensq,
    kitchentranssq,
    InviteLinks  
} = require('../models.js')

async function deleteaccount(req, res) {
    const { sessionid } = req.body;

    try {
      const user = await Users.findOne({ where: { sessionid: sessionid } });
      if(!user){
        res.status(403).json({ error: 'Not a User' });
        return;
      }
      await kitchentranssq.destroy({ where: { user_id: user.id } });

      const kitchens = await kitchensq.findAll({ where: { kitchen_owner: user.id } });

      kitchens.forEach(async (kitchen) => {
        await Item.destroy({ where: { kitchen: kitchen.kitchen_id } });
        await Shopping.destroy({ where: { kitchen: kitchen.kitchen_id } });
        await kitchentranssq.destroy({ where: { kitchen_id: kitchen.kitchen_id } });
        await mealssq.destroy({ where: { kitchen_id: kitchen.kitchen_id } });
        await InviteLinks.destroy({ where: { kitchenid: kitchen.kitchen_id } });
        await kitchen.destroy();
      });

      await user.destroy();
      res.status(200).json("Account Deleted")
    } catch (error){
      res.status(403).json({ error: error.message });
    }
    
};

module.exports = deleteaccount;
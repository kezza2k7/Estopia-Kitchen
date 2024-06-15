const checkuser = require('../utils/checkuser.js')
const { mealssq } = require('../models.js')

async function editmeals(req, res) {
    const { meals, day, month, year, sessionid, kitchenid } = req.body;
    const { breakfast, lunch, dinner, snacks } = meals
  
    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      return res.status(403).json({ error: 'No Permision' });
    }
  
    try {
      // Find the meal entry by date
      const meale = await mealssq.findOne({where: {kitchen_id: kitchenid, day:day, month:month, year:year}});
  
      if (!meale) {
        const meale = await mealssq.create({kitchen_id: kitchenid, day:day, month:month, year:year, breakfast:breakfast, lunch:lunch, dinner:dinner,snacks:snacks})
        return res.status(200).json(meale);
      }
  
      // Update the meal entry
      await meale.update({ breakfast, lunch, dinner, snacks });
      await meale.save()
      res.status(200).json(meale);
    } catch (error) {
      console.error('Error updating meal:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = editmeals;
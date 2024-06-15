const { Item } = require('../models.js')
const checkuser = require('../utils/checkuser.js')

async function create(req, res) {
    const { name, location, expiryDate, sessionid, kitchenid, barcodeid, brand, shop, novagroup, ingredients, carbs, energy, fat, satfat, fiber, proteins, sodium, sugars, image,salt } = req.body;
    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      res.status(403).json({ error: 'No Permision' });
      return;
    }

    if (!name || !location) {
      res.status(400).json({ error: 'Name and location are required' });
      return;
    }
  
    try {
      const item = await Item.create({ name, location, expiryDate, kitchen: kitchenid, barcodeid, brand, shop, novagroup, ingredients, carbs, energy, fat, satfat, fiber, proteins, sodium, sugars, image, salt });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = create;
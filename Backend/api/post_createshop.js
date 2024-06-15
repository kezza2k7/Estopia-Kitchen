const { Shopping } = require('../models.js')
const checkuser = require('../utils/checkuser.js')

async function createshop(req, res) {
    const { name, sessionid, kitchenid } = req.body;
    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      res.status(403).json({ error: 'No Permision' });
      return;
    }

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
  
    try {
      const Shop = await Shopping.create({ name, kitchen: kitchenid, selected: false });
      res.json(Shop);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = createshop;
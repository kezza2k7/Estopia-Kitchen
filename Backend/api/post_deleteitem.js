const checkuser = require('../utils/checkuser.js')
const { Item } = require('../models.js')

async function deleteitem(req, res) {
    const { id, kitchenid, sessionid } = req.body;

    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      res.status(403).json({ error: 'No Permision' });
      return;
    }
  
    try {
      const item = await Item.destroy({ where: { id: id, kitchen: kitchenid } });
      if(!item){
        res.status(403).json({ error: "Good Try" });
      }
      res.json({ item });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = deleteitem;
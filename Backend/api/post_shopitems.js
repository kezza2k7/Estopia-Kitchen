const checkuser = require('../utils/checkuser.js')
const { Shopping } = require('../models.js')

async function shopitems(req, res) {
    const { kitchenid, sessionid } = req.body;

    const perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      res.status(403).json({ error: 'No Permision' });
      return;
    }

    try {
      const items = await Shopping.findAll({where: {kitchen: kitchenid}});
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = shopitems;
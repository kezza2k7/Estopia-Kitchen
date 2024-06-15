const { Shopping } = require('../models.js')
const checkuser = require('../utils/checkuser.js')

async function deleteshop(req, res) {
  const { id, sessionid, kitchenid } = req.body;

  perm = await checkuser(sessionid, kitchenid)

  if(!perm){
    res.status(403).json({ error: 'No Permision' });
    return;
  }

  try {
    const item = await Shopping.destroy({ where: { id:id, kitchen: kitchenid} });
    res.json({ item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = deleteshop;
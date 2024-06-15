const { Item } = require('../models.js')
const checkuser = require('../utils/checkuser.js')

async function update(req, res) {
    const { name, location, id, sessionid, kitchenid, expiryDate } = req.body;
  
    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      return res.status(403).json({ error: 'No Permission' });
    }

    try {
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if(item.kitchen !== kitchenid){
            return res.status(403).json({ error: 'Not in Kitchen' });
        }
  
        if (name) {
            item.name = name;
        }
        if (location) {
            item.location = location;
        }
        if (expiryDate) {
            item.expiryDate = expiryDate;
        }
  
        await item.save();
        res.json(item).status(200);
      } catch(error){
        res.status(500).json({ error: error.message });
      }
}

module.exports = update;
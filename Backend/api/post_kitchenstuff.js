const checkuser = require('../utils/checkuser.js')
const { Item } = require('../models.js')
const { Op } = require('sequelize');

async function items(req, res) {
    const { kitchenid, sessionid, search } = req.body;

    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      res.status(403).json({ error: 'No Permission' });
      return;
    }

    try {
      let items;
      if (search) {
        items = await Item.findAll({
          where: {
              kitchen: kitchenid,
              [Op.or]: [
                  { name: { [Op.like]: `%${search}%` } },
                  { location: { [Op.like]: `%${search}%` } }
              ]
          },
          attributes: ['name'] // Only retrieve the 'name' attribute
        });
      } else {
        items = await Item.findAll({
          where: { kitchen: kitchenid },
          attributes: ['name'] // Only retrieve the 'name' attribute
        });
      }

      // Extracting names from the items
      const itemNames = items.map(item => item.name);

      res.json(itemNames);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

module.exports = items;

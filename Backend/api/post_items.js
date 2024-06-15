const checkuser = require('../utils/checkuser.js')
const { Item } = require('../models.js')
const { Op } = require('sequelize');

async function items(req, res) {
    const { kitchenid, sessionid, search } = req.body;

    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      res.status(403).json({ error: 'No Permision' });
      return;
    }

    try {
      if(search){
        const items = await Item.findAll({
          where: {
              kitchen: kitchenid,
              [Op.or]: [
                  { name: { [Op.like]: `%${search}%` } },
                  { location: { [Op.like]: `%${search}%` } }
              ]
          }
        });
        res.json(items);

      } else {
        const items = await Item.findAll({where: {kitchen: kitchenid}});
        res.json(items);

      }

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = items;
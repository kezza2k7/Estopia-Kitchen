const { Item } = require('../models.js')
const checkuser = require('../utils/checkuser.js')
const { Op } = require('sequelize');

async function create(req, res) {
    const { kitchenid, sessionid } = req.body;

    perm = await checkuser(sessionid, kitchenid)

    if(!perm){
      res.status(403).json({ error: 'No Permision' });
      return;
    }
  
    const today = new Date();
    const fiveDaysFromToday = new Date(today.getTime() + (5 * 24 * 60 * 60 * 1000));

    const expiringItems = await Item.findAll({
    where: {
        kitchen: kitchenid,
        expiryDate: {
        [Op.lt]: fiveDaysFromToday, // Less than 5 days from today
        [Op.gt]: 0
    }
    }
    });

    res.json(expiringItems);
}

module.exports = create;
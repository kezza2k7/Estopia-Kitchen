const { Users, kitchensq, kitchentranssq } = require('../models.js')

async function getuserinkitchen(req, res) {
    const { sessionid, kitchenid } = req.body;
  
    const mainuser = await Users.findOne({ where: { sessionid: sessionid } });
    if(!mainuser){
        res.status(403).json({ error: 'Not a User' });
        return;
    }
    
    const kitchen = await kitchensq.findOne({ where: { kitchen_id: kitchenid } });
    if(!kitchen){
        res.status(403).json({ error: 'Not a Kitchen' });
        return;
    }

    if(kitchen.kitchen_owner != mainuser.id){
        res.status(403).json({ error: 'Not the Owner' });
        return;
    }

    const users = await kitchentranssq.findAll({ where: { kitchen_id: kitchenid } });
    if(!users){
        res.status(403).json({ error: 'No Users' });
        return;
    }

    const userIds = await Promise.all(users.map(user => Users.findByPk(user.user_id)));

    res.json(userIds).status(200);
}

module.exports = getuserinkitchen;
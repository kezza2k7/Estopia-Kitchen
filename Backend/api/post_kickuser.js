const { Users, kitchensq, kitchentranssq } = require('../models.js')

async function getuserinkitchen(req, res) {
    const { sessionid, kitchenid, id } = req.body;
  
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

    if(kitchen.kitchen_owner !== mainuser.id){
        res.status(403).json({ error: 'Not the Owner' });
        return;
    }

    //Destroy the user from the kitchen
    const users = await kitchentranssq.destroy({ where: { kitchen_id: kitchenid, user_id: id} });

    res.json(users).status(200);
}

module.exports = getuserinkitchen;
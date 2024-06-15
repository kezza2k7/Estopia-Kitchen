const { Users, kitchensq, kitchentranssq } = require('../models.js')

async function getkitchens(req, res) {
      
    const { sessionid } = req.body;

    try {
      const user = await Users.findOne({
        where: {
          sessionid: sessionid
        }
      });

      if(!user){
        res.status(403).json({ error: 'No Permision' });
        return
      }

      const kitchens = await kitchentranssq.findAll({
          where: {
            user_id: user.id
          }
      });
      let data = [];
      await Promise.all(kitchens.map(async kitchen => {
          // Perform actions for each kitchen here
          const kitchene = await kitchensq.findOne({
              where: {
                  kitchen_id: kitchen.kitchen_id
              }
          });
          data.push({name: kitchene.kitchen_name, id: kitchene.kitchen_id, owner: kitchene.kitchen_owner});
      }));

      res.json(data)
    } catch (error) {
      console.error(error)
        res.status(500).json({ error: error.message });
    }
}

module.exports = getkitchens;
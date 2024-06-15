const { Users, kitchensq, InviteLinks } = require('../models.js')
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

async function createurl(req, res) {
    const { sessionid, kitchenid } = req.body;
  
    try {
      const user = await Users.findOne({ where: { sessionid: sessionid } });
      const kitchen = await kitchensq.findOne({ where: { kitchen_id: kitchenid, kitchen_owner: user.id } });
      if(!kitchen){
        return res.status(403).json({ error: 'No Permision' });
      }
      if (!user) {
        return res.status(404).json({ error: "Kitchen not found" });
      }
  
      // Generate a unique token for the invite link
      const inviteToken = uuidv4();
  
      // Set expiration timestamp (24 hours from now)
      const expirationTimestamp = moment().add(24, 'hours').toISOString();
  
      // Store the invite link details in your database
      await InviteLinks.create({
        token: inviteToken,
        expirationTimestamp: expirationTimestamp,
        kitchenid: kitchen.kitchen_id, // Associate the invite link with a specific kitchen
      });
      
      // Respond with the generated invite link
      res.status(200).json({ inviteLink: `https://food.estopia.net/invites/${inviteToken}`, joinCode: inviteToken });
    } catch (error) {
      console.error((error));
      res.status(500).json({ error: error.message });
    }
  };

module.exports = createurl;
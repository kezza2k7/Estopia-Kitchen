const { Users, kitchensq, InviteLinks, kitchentranssq } = require('../models.js')

async function invite(req, res) {
    const { code, sessionid } = req.body;

    try {
        // Find the user based on the session ID
        const user = await Users.findOne({ where: { sessionid: sessionid } });

        if (!user) {
            return res.status(403).json({ error: 'Invalid session ID' });
        }

        // Find the invite link based on the provided code
        const inviteLink = await InviteLinks.findOne({
            where: {
                token: code,
            }
        });

        if (!inviteLink) {
            return res.status(404).json({ error: 'Invite link not found' });
        }

        // Check if the invite link has expired
        const currentTimestamp = new Date();
        const expirationTimestamp = new Date(inviteLink.expirationTimestamp);

        if (currentTimestamp > expirationTimestamp) {
            // The invite link has expired
            inviteLink.destroy();
            return res.status(403).json({ error: 'Invite link has expired' });
        }

        // Associate the user with the kitchen (perform the necessary action)
        const kitchen = await kitchensq.findByPk(inviteLink.kitchenid);

        // Assuming you have a function to add a user to a kitchen
        await kitchentranssq.create({ user_id: user.id, kitchen_id: kitchen.kitchen_id });

        // Delete the used invite link from the database (optional)
        await inviteLink.destroy();

        res.status(200).json({ message: 'User added to the kitchen successfully' });
    } catch (error) {
        if(error.message === 'Validation error') {
            res.status(403).json({ error: 'Already in Kitchen' });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
  };

module.exports = invite;
const { Users } = require('../models.js')

async function getusers(req, res) {
    const { sessionId } = req.body;
    
    try {
        // Find the user by session ID
        const user = await Users.findOne({ where: { sessionid: sessionId } });
        if(user.additional.developer) {
            const users = await Users.findAll({attributes: { exclude: ['password', 'sessionid']}});
            return res.json(users).status(200);
        } else {
            return res.status(403).json({ error: 'No Permission', user: user });    
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = getusers;
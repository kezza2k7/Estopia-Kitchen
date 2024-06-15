const { Users } = require('../models.js')

async function checksession(req, res) {
    const { id } = req.body;
    
    try {
        // Find the user by session ID
        const user = await Users.findOne({ where: { sessionid: id } });

        if (user) {
            // If the user exists, return the username
            res.json(user);
        } else {
            // If the user doesn't exist, return null
            res.json(null);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = checksession;
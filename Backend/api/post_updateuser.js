const { Users } = require('../models.js')

async function updateuser(req, res) {
    const { sessionId, id, type, set } = req.body;
    
    try {
        // Find the user by session ID
        const user = await Users.findOne({ where: { sessionid: sessionId } });
        if(user.additional.developer) {
            const users = await Users.findByPk( id );
            if(!users){
                res.status(403).json({ error: 'No User' });
                return;
            }
            
            if(!users.additional){
                users.additional = {};
            }

            users.setDataValue('additional', { ...users.additional, [type]: set });

            await users.save();
            res.json(users).status(200);
        } else {
            res.status(403).json({ error: 'No Permission', user: user });    
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = updateuser;
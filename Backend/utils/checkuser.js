const {Users, kitchentranssq} = require('../models.js')

async function checkuser(sessionid, kitchenid){
    try {
        // Find the user by session ID
        const user = await Users.findOne({ where: { sessionid: sessionid } });
  
        if (user) {
            const Trans = await kitchentranssq.findOne({ where: { user_id: user.id, kitchen_id: kitchenid } });
  
            if (Trans) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    } catch (error) {
        console.error(`Error checking user: ${error.message}`);
    }
}

module.exports = checkuser;
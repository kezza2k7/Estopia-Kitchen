const { Users } = require('../models.js')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function login(req, res) {
    const { username, password } = req.body;
  
    try {
      // Find the user by username
      const user = await Users.findOne({ where: { username } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the provided password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        // Generate a random UUID
        const randomUUID = uuidv4();
        user.sessionid = randomUUID
        user.save()
        res.status(200).json({ sessionid: user.sessionid });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
        console.error(error)
      res.status(500).json({ error: error.message });
    }
}

module.exports = login;
const { Users } = require('../models.js')
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function register(req, res) {
    const { username, password } = req.body;
  
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const randomUUID = uuidv4();
  
      // Create a new user with hashed password
      const user = await Users.create({ username, password: hashedPassword, sessionid: randomUUID });
  
      res.status(200).json({ sessionid: randomUUID, user: user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

module.exports = register;
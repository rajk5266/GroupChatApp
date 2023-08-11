const path = require('path')
const Users = require('../models/users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const token = process.env.TOKEN

exports.loginpage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login', 'login.html'))
}

function generateToken (Id){
    return jwt.sign({userId: Id}, token)
}

exports.loginDetails =  async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await Users.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      } else {
        const passwordMatching = await bcrypt.compare(password, user.password);
        if (passwordMatching) {
           res.status(200).json({ success: true, message: 'Logged in successfully' , token: generateToken(user.id)});
        } else {
          return res.status(400).json({ success: false, message: 'Incorrect password' });
        } 
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
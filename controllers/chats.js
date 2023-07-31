const path = require('path')
const Users = require('../models/users')


exports.chatWindow = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'chatwindow', 'chatwindow.html'))
}

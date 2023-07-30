const path = require('path')

exports.loginpage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login', 'login.html'))
}

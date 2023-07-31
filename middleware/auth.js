require('dotenv').config()
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = (req, res, next) =>{
    try{
        const token = req.header('Authorization');
        const {userId} = jwt.verify(token, process.env.TOKEN)
       
        User.findByPk(userId).then(user => {
            req.user = userId;
            next()
        })
        .catch(err => {
            console.log(err)
        })
    }catch(err){
        console.log(err)
        return res.status(401).json({success: false})
    }
}

module.exports = {auth}
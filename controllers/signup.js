const path = require('path')
const Users = require('../models/users')
const bcrypt = require('bcrypt');

exports.signUpPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup', 'signUp.html'))
}

exports.userSignUpDetails = async (req, res) => {
    try {
        // console.log(req.body)
        const { username, email, password } = req.body;
        const saltrounds = 10;
        const userExist = await Users.findOne({
            where: { email }
        })
        if (userExist) {
            return res.status(409).json({ message: "user already exist" })
        }
        const userName = await Users.findOne({
            where: {
                username
            }
        })
        if(userName){
           return res.status(409).json({message: "username already taken"})
        }
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            await Users.create({
                username,
                email,
                password: hash
            })
            res.status(200).json({ message: "user added succesfully" })
        })
    } catch (err) {
        console.log('error', err)
        res.status(500).json({ message: 'something went wrong' })
    }
}
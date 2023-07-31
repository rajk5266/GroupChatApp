const path = require('path')
const Users = require('../models/users')
const Chats = require('../models/chats')

exports.chatWindow = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homepage', 'homepage.html'))
}

exports.getAllUsers = async (req, res) => {
    // console.log(req.user)
    try{
          const users = await Users.findAll()
          const names = users.map(user => user.dataValues.name);
        //   console.log( "names", names)
        res.status(200).json({names: names})
    }catch(err){
        console.log(err)
    }
}

exports.saveMessages = async (req, res) => {
    try{
        console.log(req.user)
        const message = req.body
        const name = await Users.findOne({
            where:{
                id: req.user
            }
        })
        const messageOwner = name.dataValues.name
        // console.log(messageOwner)
        const messageToSave = await Chats.create({
            name: messageOwner,
            message:message,
            userId: req.user
        })
        console.log(chatsToSave)
      
    }catch(err){
        console.log(err)
    }
}
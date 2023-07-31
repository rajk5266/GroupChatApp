const path = require('path')
const Users = require('../models/users')
const Chats = require('../models/chats')

exports.homePage = (req, res) => {
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

exports.getAllMessages = async (req, res) => {
    try{
        const messages = await Chats.findAll()

        const usersMessages = []
        for(let i=0; i<messages.length; i++){
            // console.log(messages[i].dataValues)
            const message = messages[i].dataValues;
            if(message.userId == req.user){
                // console.log('true')
                message.isOwnMessage = true
            }else{
                message.isOwnMessage = false
            }
            usersMessages.push(message)
        }
        // console.log(usersMessages)
        res.status(200).json({usersMessages})
        
    }catch(err){
        console.log(err)
    }
}

exports.saveMessages = async (req, res) => {
    try{
        // console.log('req.user',req.user)
        const {message, formattedDate} = req.body
        // console.log(message,date)
        const name = await Users.findOne({
            where:{
                id: req.user
            }
        })

        const messageOwner = name.dataValues.name
        const messageToSave = await Chats.create({
            name: messageOwner,
            message:message,
            userId: req.user,
            date:formattedDate
        })
        // console.log(messageToSave)
        res.status(200).json({message: "message saved successfully"})
      
    }catch(err){
        console.log(err)
    }
}
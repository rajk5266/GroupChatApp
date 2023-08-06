const path = require('path')
const Users = require('../models/users')
const Chats = require('../models/chats')
const { Sequelize } = require('sequelize')

exports.homePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homepage', 'homepage.html'))
}

exports.getAllUsers = async (req, res) => {
    try{
          const users = await Users.findAll()
          const usernames = users.map(user => user.dataValues.username);
        res.status(200).json({usernames})
    }catch(err){
        console.log(err)
    }
}

exports.getAllMessages = async (req, res) => {
    try{
        // console.log(req.params)
        const lastMessageId = req.params.id;
        const groupId = req.params.groupId;
        let messages;

        if(lastMessageId === undefined){
             messages = await Chats.findAll({
                where:{
                    groupId: groupId
                }
             })
        }
        else{
             messages = await Chats.findAll({
                where: {
                    id: {
                        [Sequelize.Op.gt]: lastMessageId
                    },
                    groupId: groupId
                }
            })
        }
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
        // console.log(req.body)
        // const message = req.body.message;
        // const date = req.body.date;
        // const isOwnMessage = req.body.isOwnMessage;
        // const groupId = req.body.groupId
        const {message,date,groupId} = req.body
        // console.log(message,"---",date,)
        const userName = await Users.findOne({
            where:{
                id: req.user
            }
        })

        const messageOwner = userName.dataValues.username
        const messageToSave = await Chats.create({
            username: messageOwner,
            message,
            userId: req.user,
            groupId,
            date
        })
        // console.log(messageToSave)
        res.status(200).json({message: "message saved successfully"})
      
    }catch(err){
        console.log(err)
    }
}
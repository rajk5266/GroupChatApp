require('dotenv').config();
const path = require('path')
const Users = require('../models/users')
const Chats = require('../models/chats')
const { Sequelize } = require('sequelize')
const AWS = require('aws-sdk')
const { io } = require('../app')

exports.homePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'homepage', 'homepage.html'))
}

exports.saveMessages = async (req, res) => {
    try {
        const { message, date, groupId } = req.body
        const userName = await Users.findOne({
            where: {
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
        res.status(200).json({ message: "message saved successfully" })
    } catch (err) {
        console.log(err)
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll()
        const usernames = users.map(user => user.dataValues.username);
        res.status(200).json({ usernames })
    } catch (err) {
        console.log(err)
    }
}


exports.getAllMessages = async (req, res) => {
    try {
        // console.log(req.params)
        const lastMessageId = req.params.id;
        const groupId = req.params.groupId;
        let messages;

        if (lastMessageId === undefined) {
            messages = await Chats.findAll({
                where: {
                    groupId: groupId
                }
            })
        }
        else {
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
        for (let i = 0; i < messages.length; i++) {
            // console.log(messages[i].dataValues)
            const message = messages[i].dataValues;
            if (message.userId == req.user) {
                // console.log('true')
                message.isOwnMessage = true
            } else {
                message.isOwnMessage = false
            }
            usersMessages.push(message)
        }
        // console.log(usersMessages)
        res.status(200).json({ usersMessages })

    } catch (err) {
        console.log(err)
    }
}

<<<<<<< HEAD
function uploadToS3(decodedBuffer, filename) {
    const BUCKET_NAME = process.env.S3BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: decodedBuffer,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('something went wrong', err)
                reject(err)
            } else {
                console.log('success', s3response)
                resolve(s3response.Location);
            }
        })
    })

}

exports.saveMediaFile = async (req, res) => {
    try {
        const base64Data = req.body.media;
        const groupId = req.body.groupId;
        const decodedBuffer = Buffer.from(base64Data, 'base64');
        const date = req.body.date;

        const filename = `Img-${req.user}/${new Date()}.txt`;
        const fileURL = await uploadToS3(decodedBuffer, filename);

=======
exports.saveMessages = async (req, res) => {
    try{
        // console.log('req.user',req.user)
        // console.log(req.body)
        // const message = req.body.message;
        // const date = req.body.date;
        // const isOwnMessage = req.body.isOwnMessage;
        // const groupId = req.body.groupId
        const {message,date,groupId} = req.body
        console.log(message,"---",date,)
>>>>>>> render
        const userName = await Users.findOne({
            where: {
                id: req.user
            }
        })
        const messageOwner = userName.dataValues.username
        // console.log(messageOwner)
        const messageToSave = await Chats.create({
            username: messageOwner,
            message: fileURL,
            userId: req.user,
            groupId,
            date
        })
        res.status(200).send({ message: "succes", fileURL: fileURL })
    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, fileURL: '' });
    }
}


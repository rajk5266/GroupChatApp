const path = require('path')
const Users = require('../models/users')
const Chats = require('../models/chats')
const Group = require('../models/groups')
const { Sequelize } = require('sequelize')

exports.createGroup = async (req, res) => {
    try{
        const {groupName} = req.body
        const createGroup = await Group.create({
            groupname: groupName,
            admin: req.user
        })
        const groupDetails = createGroup.dataValues
        res.status(200).json({groupDetails})

    }catch(err){
        console.log(err)
    }

}

exports.getAllGroups = async (req, res) => {
    try{
        const allGroups = await Group.findAll({
            where: {
                admin: req.user
            }
        })
        const groups = allGroups.map(group => group.dataValues)
        // console.log(groups)
        res.status(200).json({groups})

    }catch(err){
        console.log(err)
    }
}
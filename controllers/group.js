// const path = require('path')
const Users = require('../models/users')
const Chats = require('../models/chats')
const Group = require('../models/groups')
const GroupUsers = require('../models/group_users')
const { Sequelize } = require('sequelize')

exports.createGroup = async (req, res) => {
    try {
        const { groupName, username } = req.body
        const createGroup = await Group.create({
            groupname: groupName,
            admin: username
        })
        const groupDetails = createGroup.dataValues
        const groupId = groupDetails.id

        const groupAdmin = GroupUsers.create({
            username,
            groupId,
            isAdmin: true,
            // userId: req.user
        })
        res.status(200).json({ groupDetails })

    } catch (err) {
        console.log(err)
    }

}

exports.getAllGroups = async (req, res) => {
    try {
        const { username } = req.params
        const groupIds = await GroupUsers.findAll({
            where: {
                username
            }
        })
        const Ids = groupIds.map(Id => Id.dataValues.groupId)
        const allGroups = await Group.findAll({
            where: {
                id: Ids
            }
        })
        if (!allGroups) {
            return res.status(409).json({ message: "no group exist" })
        }
        const groups = allGroups.map(group => group.dataValues)
        res.status(200).json({ groups })

    } catch (err) {
        console.log(err)
    }
}

exports.searchUser = async (req, res) => {
    try {
        const user = req.params.user
        const userExist = await Users.findOne({
            where: {
                username: user
            }
        })
        if (!userExist) {
            return res.status(409).json({ message: "no user found" })
        }
        // console.log(userExist.dataValues.username)
        res.status(200).json({ user: userExist.dataValues.username })
    } catch (err) {
        console.log(err)
    }
}

exports.addUserToGroup = async (req, res) => {
    try {

        const groupId = req.params.groupId;
        const username = req.body.username;
        const userExist = await GroupUsers.findOne({
            where: {
                username,
                groupId
            }
        })
        if (userExist) {
            // console.log('exist')
            return res.status(305).json({ message: "user already exist" })
        }

        const addUser = await GroupUsers.create({
            username,
            groupId,
            isAdmin: false
        })
        // console.log(userExist)
        // console.log("datatatata",addUser.dataValues)
        const respo = addUser.dataValues
        res.status(200).json(respo)



    } catch (err) {
        console.log(err)
    }
}

exports.showGroupMembers = async (req, res) => {
    try {
        const { groupId } = req.params;

        const groupMembers = await GroupUsers.findAll({
            where: {
                groupId
            }
        })
        const members = groupMembers.map(members => members.dataValues)
        // console.log(members)
        res.status(200).json(members)
    } catch (err) {
        console.log(err)
    }
}

exports.removeMember = async (req, res) => {
    try {
        const { groupId, username } = req.params;
        const removeMember = await GroupUsers.destroy({
            where: {
                groupId,
                username
            }
        })
        //  console.log(removeMember)
        res.status(200).json({ message: "user removed successfully" })
    } catch (err) {
        console.log(err)
    }
}

exports.makeAdmin = async (req, res) => {
    try {
        const { groupId, username } = req.params;
        console.log(groupId, username)

        const group = await Group.findOne({
            where: {
                id: groupId,
            }
        })
        //  console.log(makeAdmin)
        const existingAdmins = group.admin.split(',')
        // console.log(existingAdmins)
        existingAdmins.push(username)
        // console.log(existingAdmins)

           const updateAdmins=  await Group.update(
                { admin: existingAdmins.join(',') }, 
                {
                  where: {
                    id: groupId,
                  },
                }
              );
        // console.log(updateAdmins)
        const check = await GroupUsers.update(
            {isAdmin: true },
            {
                where: {
                    username
                },
            }
        )
        console.log("check", check)
        res.status(200).json({ message: "user has became admin" })
    } catch (err) {
        console.log(err)
    }
}

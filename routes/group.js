const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const controller = require('../controllers/group')

router.get('/getAllGroups/:username', auth.auth,controller.getAllGroups)

router.post('/createGroup', auth.auth, controller.createGroup)

router.get('/searchUser/:user', auth.auth, controller.searchUser )

router.post('/addUserToGroup/:groupId', auth.auth, controller.addUserToGroup)

router.get('/getGroupMemebersList/:groupId', auth.auth, controller.showGroupMembers)

router.delete('/removeMember/:groupId/:username', auth.auth, controller.removeMember)

router.put('/makeMemberAdmin/:groupId/:username', controller.makeAdmin)


module.exports = router
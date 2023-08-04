const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const controller = require('../controllers/group')

router.get('/getAllGroups', auth.auth,controller.getAllGroups)

router.post('/createGroup', auth.auth, controller.createGroup)


module.exports = router
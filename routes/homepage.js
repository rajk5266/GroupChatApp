const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')

const controller = require('../controllers/homepage');

router.get('/chats',controller.chatWindow)

router.get('/getAllUsers',auth.auth, controller.getAllUsers )

router.post('/messages', auth.auth, controller.saveMessages)

module.exports = router
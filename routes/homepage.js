const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const controller = require('../controllers/homepage');

router.get('/homePage',controller.homePage)

router.get('/getAllUsers',auth.auth, controller.getAllUsers )

router.get('/getAllMessages/:id/:groupId', auth.auth, controller.getAllMessages)

router.post('/messages', auth.auth, controller.saveMessages)

module.exports = router
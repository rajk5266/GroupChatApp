const express = require('express');
const router = express.Router();

const controller = require('../controllers/chats');

router.get('/chats', controller.chatWindow)

module.exports = router
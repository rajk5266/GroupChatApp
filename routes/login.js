const express = require('express');
const router = express.Router();

const controller = require('../controllers/login');

router.get('/', controller.loginpage)

module.exports = router
const express = require('express')

const router = express.Router()
const controller = require('../controllers/signup')

router.get('/signup', controller.signUpPage)

router.post('/signup', controller.userSignUpDetails)

module.exports = router
require('dotenv').config();
const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const sequelize = require('./util/database')
const cors = require('cors')
const app = express();

app.use(cors())

const signup = require('./routes/signup')
const login = require('./routes/login')
const chats = require('./routes/chats')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', signup)
app.use('/', login)
app.use('/', chats)


sequelize
    .sync()
    .then(result => {
        console.log('database connected')
        app.listen(process.env.PORT || 5000)
    })
    .catch(err => console.log(err))
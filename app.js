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
const homePage = require('./routes/homepage')
const group = require('./routes/group')

const User = require('./models/users')
const Chats = require('./models/chats')
const Group = require('./models/groups')
const GroupUsers = require('./models/group_users')


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

User.hasMany(Chats)
Chats.belongsTo(User)
Chats.belongsTo(Group)
Group.hasMany(Chats)
Group.hasMany(GroupUsers)

GroupUsers.belongsTo(Group)

app.use('/', signup)
app.use('/', login)
app.use('/', homePage)
app.use('/', group)


sequelize
    .sync()
    .then(result => {
        console.log('database connected')
        app.listen(process.env.PORT || 5000)
    })
    .catch(err => console.log(err))
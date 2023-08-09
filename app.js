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
const GroupUsers = require('./models/group_users');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

User.hasMany(Chats)
Chats.belongsTo(User)

Chats.belongsTo(Group)

// User.hasMany(GroupUsers)
Group.hasMany(Chats)
Group.hasMany(GroupUsers)

// GroupUsers.belongsTo(User)
GroupUsers.belongsTo(Group)

app.use('/', signup)
app.use('/', login)
app.use('/', homePage)
app.use('/', group)

sequelize
    .sync()
    .then(result => {
        console.log('database connected')
        const server = app.listen(process.env.PORT || 3000, () => {
            console.log(`server is running on port 3000`)
        })
        const io = require('socket.io')(server)
        io.on('connection', socket => {
            console.log('A user Connected');
            // console.log('socketID', socket.id)
            console.log(socket.id)
            socket.on('send-message', (messageObj) => {
                socket.broadcast.emit('receive-message', messageObj);
                console.log("-----", messageObj);
            });
            socket.on('disconnect', () => {
                console.log('user disconnected')
            })
        })
    })
    .catch(err => console.log(err))
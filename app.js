const express = require('express')
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

app.use(cors())

const signup = require('./routes/signup')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))
app.use('/', signup)


app.listen(5000, () => {
    console.log('Server is running');
  });
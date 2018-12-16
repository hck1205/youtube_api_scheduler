const express  = require('express');
const CONFIG = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(CONFIG.CONNECTION_STRING, {useNewUrlParser: true});
mongoose.Promise = global.Promise;

const student = require('./routes/student');
const indexRoute = require('./routes/index')
const personRoute = require('./routes/person')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use([indexRoute, personRoute, ]);
app.use('/student', student);

app.listen(CONFIG.PORT, ()=> {
    console.log(`Runninng on port ${CONFIG.PORT}`);
});

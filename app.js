const express  = require('express');
const CONFIG = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(CONFIG.CONNECTION_STRING, {useNewUrlParser: true});
mongoose.Promise = global.Promise;

const indexRoute = require('./routes/index')
const videoRoute = require('./routes/video');
const personRoute = require('./routes/person')

const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use([indexRoute, videoRoute, personRoute, ]);
app.use('/video', videoRoute);

app.listen(CONFIG.PORT, ()=> {
    console.log(`Runninng on port ${CONFIG.PORT}`);
});

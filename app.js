const express  = require('express');
const CONFIG = require('./config');
const bodyParser = require('body-parser');

const indexRoute = require('./routes/index');
const videoRoute = require('./routes/video');
const channelRoute = require('./routes/channel');
const rankRoute = require('./routes/rank');

const app = express();

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use([indexRoute, videoRoute, channelRoute, rankRoute]);
app.use('/video', videoRoute);
app.use('/channel', channelRoute);
app.use('/rank', rankRoute);

app.listen(CONFIG.PORT, ()=> {
    console.log(`Runninng on port ${CONFIG.PORT}`);
});

let express  = require('express');
let app = express();

let indexRoute = require('./routes/index')
let personRoute = require('./routes/person')

app.use([indexRoute, personRoute]);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Runninng on port ${PORT}`);
});

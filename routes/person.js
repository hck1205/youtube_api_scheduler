let express = require('express');
let router = express.Router()

router.get('/person', (req, res) => {
    res.send('You have requested person');
});

module.exports = router
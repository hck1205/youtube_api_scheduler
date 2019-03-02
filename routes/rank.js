const express = require('express');
const router = express.Router()
const rankController = require('../controllers/rank');

router.get('/channel/list', rankController.getChannelListInfo);


module.exports = router;
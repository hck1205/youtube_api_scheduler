const express = require('express');
const router = express.Router()
const channelController = require('../controllers/channel');

router.get('/list/:categoryType', channelController.getChannelListWithStatistics);

module.exports = router;
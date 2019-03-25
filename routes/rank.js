const express = require('express');
const router = express.Router()
const rankController = require('../controllers/rank');

router.get('/rank/all', rankController.rankAllChannels);

module.exports = router;
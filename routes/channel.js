const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel');

router.get('/category/popular', channelController.getCategoryList);
router.get('/list/:categoryType', channelController.getChannelList);

module.exports = router;
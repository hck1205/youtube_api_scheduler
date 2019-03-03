const express = require('express');
const router = express.Router()
const rankController = require('../controllers/rank');

router.get('/channel/list', rankController.getLargeCategoryChannelListInfo);


module.exports = router;
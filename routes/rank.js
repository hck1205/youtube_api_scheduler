const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rank');

router.get('/all', rankController.rankAllChannels);
router.get('/:categoryType', rankController.rankByCategory);

module.exports = router;
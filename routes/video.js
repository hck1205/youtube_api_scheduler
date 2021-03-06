const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video');

router.get('/category/popular', videoController.getCategoryList);
router.get('/list/popular', videoController.getMostPopularVideo);
router.get('/list/popular/:type', videoController.getPopularVideoList);
router.get('/list/:categoryType', videoController.getChannelList);

module.exports = router;
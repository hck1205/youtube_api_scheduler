const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video');

router.get('/category', videoController.getCategoryList);
router.get('/list', videoController.getMostPopularList);


module.exports = router;
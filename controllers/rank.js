const axios = require('axios');
const axiosConfig = require('../config/axiosConfig');
const apiConfig = require('../config/apiConfig');
const fs = require('fs');


exports.getChannelListInfo = (req, res) => {
  let apiParams = {
    part: "snippet",
    pageToken: ""
  };

  fs.readdirSync('./json/youtubeApi/channelListInLargeCategory').forEach(file => {
    console.log(file);
  });
};
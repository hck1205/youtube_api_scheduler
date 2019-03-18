const axios = require('axios');
const axiosConfig = require('../config/axiosConfig');
const apiConfig = require('../config/apiConfig');
const fs = require('fs');

let apiCalls = 0;

/**
 * Get Youtube Category ID List
 * */
exports.getCategoryList = (req, res) => {
  let apiParams = {
    part: "snippet",
    regionCode: "KR"
  };

  axios(axiosConfig(
    "GET",
    apiConfig.largeCategoryList,
    apiParams)).then((response) => {

    let newItemList = []
    for (let item of response.data.items) {
      if(item.snippet.assignable) newItemList.push(item)
    }

    response.data.items = newItemList;

    fs.writeFile('./json/youtubeApi/largeChannelCategory.json', JSON.stringify(response.data, null, 2), 'utf8',
      (err) => {
        if(err) throw err;
        console.log("completed writing largeChannelCategory.json file!");
      });
  })
};

exports.getChannelList = (req, res) => {
  if(req.params.categoryType === "large") {
    getChannelListInLargeCategory();
  } else if(req.params.categoryType === "small") {
    getChannelListInSmallCategory();
  } else {
    res.send("You are not allowed to access");
  }
};

/**
 * Get Youtube Channels & Videos info list by Category ID
 * */
const getChannelListInLargeCategory = () => {

  const largeChannelCategory = JSON.parse(fs.readFileSync('./json/youtubeApi/largeChannelCategory.json', 'utf8'));

  for (const category of largeChannelCategory.items) {
    writeLargeCategoryChannelList(category.snippet.title, category.id);
  }

};


/**
 * Get Youtube Video List by Search Word
 **/
const getChannelListInSmallCategory = () => {

  const smallChannelCategory = JSON.parse(fs.readFileSync('./json/youtubeApi/smallChannelCategory.json', 'utf8'));

  for (const category of smallChannelCategory.items) {
    writeSmallCategoryChannelList(category);
  }

};


/**
 * Get categories from largeChannelCategory.json file
 * and take them as param to call getVideoList API
 * */
const writeLargeCategoryChannelList = (title, id) => {

  let completeFlag = false;

  /**
   * Warning: Do not change apiParams!
   * */
  const apiParams = {
    part: "snippet",
    chart: "mostPopular",
    maxResults: 50,
    regionCode: "KR",
    videoCategoryId: id
  };

  let videoList = {
    title: title,
    categoryId: id,
    items: []
  };

  let getVideoList = () => {
    axios(axiosConfig(
      "GET",
      apiConfig.mostPopularVideoList,
      apiParams)).then((response) => {
      videoList.items = videoList.items.concat(response.data.items);
      if(videoList.items.length === 0) { // if video is not found
        completeFlag = true;
      } else if (!response.data.hasOwnProperty("nextPageToken") && response.data.hasOwnProperty("prevPageToken")) { // 'if condition' identifies last api call for the category
        fs.writeFile(`./json/youtubeApi/channelListInLargeCategory/category_${id}.json`, JSON.stringify(videoList, null, 2), 'utf8',
          (err) => {
            if (err) throw err;
            completeFlag = true;
            console.log(`completed writing large category_${id}.json file!`);
          });
      } else { // if response has page token then call api again until it reaches last api call
        apiParams.pageToken = response.data.nextPageToken;
        getVideoList(); // Recursive func
      }
    }).catch(error => {
      let errLog = { status: error.response.status, statusText: error.response.statusText };
      console.error("writeChannelList:", errLog);
    });
  };

  if(!completeFlag) getVideoList(); // Recursive Start

};

/**
 * Get categories from smallChannelCategory.json file
 * and take them as param to call getVideoList API
 * */
const writeSmallCategoryChannelList = (category) => {

  let completeFlag = false;
  let startCount = 0;
  const maxCount = 3;

  /**
   * Warning: Do not change apiParams!
   * */
  let apiParams = {
    part: "snippet",
    maxResults: 50,
    order: category.order,
    q: category.query,
    regionCode: "KR",
    relevanceLanguage: "ko",
    topicId: category.topicId,
    type: "channel"
  };

  let channelList = {
    title: category.title,
    categoryId: category.id,
    items: []
  };

  let getChannelList = () => {
    if(startCount < maxCount) {
      console.log("getVideoList")
      startCount++;
      axios(axiosConfig(
        "GET",
        apiConfig.channelListInSmallCategory,
        apiParams)).then((response) => {
        channelList.items = channelList.items.concat(response.data.items);
        if(channelList.items.length === 0) { // if video is not found
          completeFlag = true;
        } else if (startCount === maxCount) { // 'if condition' identifies last api call for the category
          writeJsonFile(channelList);
          completeFlag = true;
        } else { // if response has page token then call api again until it reaches last api call
          if(response.data.nextPageToken !== "") {
            apiParams.pageToken = response.data.nextPageToken;
            getChannelList(); // Recursive func
          } else {
            writeJsonFile(channelList);
            completeFlag = true;
          }
        }
      }).catch(error => {
          console.log(error.response.data)
          let errLog = { status: error.response.status, statusText: error.response.statusText };
          console.log(errLog)
        });
      };
    };

  if(!completeFlag) getChannelList(); // Recursive Start
};

const writeJsonFile = (channelList) => {
  try {
    let hasMissingCategoryFile = fs.existsSync(`./json/youtubeApi/missingChannelsInSmallCategory/category_${channelList.categoryId}.json`);
    if(hasMissingCategoryFile) {
      const missingChannelList = JSON.parse(fs.readFileSync(`./json/youtubeApi/missingChannelsInSmallCategory/category_${channelList.categoryId}.json`, 'utf8'));
      channelList.items = channelList.items.concat(missingChannelList.items);
    }
  } catch (e) {
    console.log(e);
  }
  finally {
    fs.writeFile(`./json/youtubeApi/channelListInSmallCategory/category_${channelList.categoryId}.json`, JSON.stringify(channelList, null, 2), 'utf8',
      (err) => {
        if (err) throw err;
        console.log(`completed writing small category_${channelList.categoryId}.json file!`);
      });
  }
};

exports.getMostPopularVideo = () => {
  let apiParams = {
    part: "id, snippet, contentDetails, player, statistics, topicDetails",
    chart: "mostPopular",
    maxResults: 10,
    regionCode: "KR"
  };

  try {
    axios(axiosConfig(
      "GET",
      apiConfig.mostPopularVideoList,
      apiParams)).then((response) => {
      fs.writeFile('./json/youtubeApi/mostPopularVideoList/popularVideoList.json', JSON.stringify(response.data, null, 2), 'utf8',
        (err) => {
          if(err) throw err;
          console.log("completed writing popularVideoList.json file!");
        });
    })
  } catch (error) {
    console.error("getMostPopularVideo:", error);
  }

};

exports.getPopularVideoList = (req, res) => {
  let apiParams = {};
  let filePath = "";

  if(req.params.type === "music") {
    apiParams.part = "id, snippet, player, statistics";
    apiParams.chart = "mostPopular";
    apiParams.maxResults = 50;
    apiParams.regionCode = "KR";
    apiParams.videoCategoryId = 10;
    filePath = "popularMusicVideoList";
  }

  if(req.params.type === "us") {
    apiParams.part = "id, snippet, contentDetails, player, statistics, status, topicDetails";
    apiParams.chart = "mostPopular";
    apiParams.maxResults = 50;
    apiParams.regionCode = "US";
    filePath = "popularUSVideoList";
  }


  try {
    axios(axiosConfig(
      "GET",
      apiConfig.mostPopularVideoList,
      apiParams)).then((response) => {
      fs.writeFile(`./json/youtubeApi/${filePath}/${filePath}.json`, JSON.stringify(response.data, null, 2), 'utf8',
        (err) => {
          if(err) throw err;
          console.log(`completed writing ${filePath}.json file!`);
        });
    })
  } catch (error) {
    console.error("popularVideoList:", error);
  }

};

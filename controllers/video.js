const axios = require('axios');
const axiosConfig = require('../config/axiosConfig');
const apiConfig = require('../config/apiConfig');
const fs = require('fs');

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
    apiConfig.largeVideoCategoryList,
    apiParams)).then((response) => {

    let newItemList = []
    for (let item of response.data.items) {
      if(item.snippet.assignable) newItemList.push(item)
    }

    response.data.items = newItemList;

    fs.writeFile('./json/youtubeApi/largeVideoCategory.json', JSON.stringify(response.data, null, 2), 'utf8',
      (err) => {
      if(err) throw err;
      console.log("completed writing largeVideoCategory.json file!");
    });
  })
};


/**
 * Get Youtube Video List by Category ID
 * */
exports.getVideoListInLargeCategory = (req, res) => {

  const largeVideoCategory = JSON.parse(fs.readFileSync('./json/youtubeApi/largeVideoCategory.json', 'utf8'));

  for (const category of largeVideoCategory.items) {
    writeVideoList(category.snippet.title, category.id);
  }
};


/**
 * Get categories from largeVideoCategory.json file
 * and take them as param to call getVideoList API
 * */
const writeVideoList = (title, id) => {

  let completeFlag = false;

  let apiParams = {
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
        apiConfig.videoListInLargeCategory,
        apiParams)).then((response) => {
        videoList.items = videoList.items.concat(response.data.items);
        if(videoList.items.length === 0) { // if video is not found
          completeFlag = true;
        } else if (!response.data.hasOwnProperty("nextPageToken") && response.data.hasOwnProperty("prevPageToken")) { // 'if condition' identifies last api call for the category
          fs.writeFile(`./json/youtubeApi/videoListInLargeCategory/category_${id}.json`, JSON.stringify(videoList, null, 2), 'utf8',
            (err) => {
              if (err) throw err;
              completeFlag = true;
              console.log(`completed writing category_${id}.json file!`);
            });
        } else { // if response has page token then call api again until it reaches last api call
          apiParams.pageToken = response.data.nextPageToken;
          getVideoList(); // Recursive func
        }
      }).catch(error => {
        let errLog = { status: error.response.status, statusText: error.response.statusText };
        console.error("writeVideoList:", errLog);
      });
  };

  if(!completeFlag) getVideoList(); // Recursive Start

};


// exports.create = function(req, res) {
//     let student = new Student({
//         name: req.body.name,
//         age: req.body.age
//     });
//

//     student.save(() => {
//         res.send('Saved!');
//     });
// };

// exports.get = (req, res) => {
//     Student.find((error, students) => {
//         res.send(students);
//     })
// };
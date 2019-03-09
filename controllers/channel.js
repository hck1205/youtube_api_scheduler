const axios = require('axios');
const axiosConfig = require('../config/axiosConfig');
const apiConfig = require('../config/apiConfig');
const fs = require('fs');


exports.getChannelListWithStatistics = (req, res) => {

  let categoryFilePath = "";
  let writtenFileDestination = "";

  if(req.params.categoryType === "large") {
    categoryFilePath = './json/youtubeApi/channelListInLargeCategory';
    writtenFileDestination = './json/youtubeApi/channelListWithStatistics/largeCategory';
  } else if(req.params.categoryType === "small") {
    categoryFilePath = './json/youtubeApi/channelListInSmallCategory';
    writtenFileDestination = './json/youtubeApi/channelListWithStatistics/smallCategory';
  } else {
    res.send("Not allow to enter");
  }


  /**
   * YouTube Allows only 50 channels to make an Api call.
   * */
  const maxChannelLength = 50;
  let channelListStore = {};

  let categoryFileList = fs.readdirSync(categoryFilePath);

  categoryFileList.forEach( (fileName, fileIndex) => {

    const channelListFile = JSON.parse(fs.readFileSync(`${categoryFilePath}/${fileName}`, 'utf8'));

    let apiCallCount = 1;
    let idField = "";

    channelListFile.items.forEach( (item, index) => {

      /**
       * Gather channel name until it reaches 50 channels
       * */
      if(index < apiCallCount * maxChannelLength) {
        idField !== "" ?  idField = idField.concat(",", item.snippet.channelId) : idField = item.snippet.channelId;
      }


      /**
       * when it reaches 50 channels
       * */
      if(index === (apiCallCount * maxChannelLength) - 1 || index === channelListFile.items.length - 1 ) {
        apiCallCount++;
        let category = channelListFile.title.replace(/ /g, "");

        if(!channelListStore.hasOwnProperty(category)) {
          channelListStore[category] = {}
          channelListStore[category].category = category;
          channelListStore[category].id = channelListFile.categoryId;
          channelListStore[category].type = "large";
          channelListStore[category].items = [];
        }

        let sendAjax = async function(category, idField) {

          await axios(axiosConfig(
            "GET",
            apiConfig.channelDetailInfoList,
            {
              part: "snippet, statistics",
              id: idField
            }
          )).then(response => {

            if(channelListStore.hasOwnProperty(category)) {
              channelListStore[category].items = channelListStore[category].items.concat(response.data.items)
            } else {
              channelListStore[category] = {}
              channelListStore[category].category = category;
              channelListStore[category].id = channelListFile.categoryId;
              channelListStore[category].type = "large";
              channelListStore[category].items = [];
            }

            /**
             * when index matches last element index, execute writing json file
             * */
            if(index === channelListFile.items.length - 1 ) {
              let channelList = channelListStore[category];
              fs.writeFile(`${writtenFileDestination}/category_${category}.json`,
                JSON.stringify(channelList, null, 2), 'utf8', (err) => {
                  if (err) throw err;
                  console.log(`completed category_${category}.json file!`);
                });
            }

          });
        };
        sendAjax(category, idField);
        idField = "";
      };

    }); // end channelListFileObjList.forEach()

  }); // end categoryFileList.forEach()

};
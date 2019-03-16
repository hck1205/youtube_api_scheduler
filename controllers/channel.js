const axios = require('axios');
const axiosConfig = require('../config/axiosConfig');
const apiConfig = require('../config/apiConfig');
const fs = require('fs');


exports.getChannelListWithStatistics = (req, res) => {

  let categoryFilePath = "";
  let writtenFileDestination = "";
  const categorySizeType = req.params.categoryType;

  if(categorySizeType === "large") {
    categoryFilePath = './json/youtubeApi/channelListInLargeCategory';
    writtenFileDestination = './json/youtubeApi/channelListWithStatistics/largeCategory';
  } else if(categorySizeType === "small") {
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

  for (const fileName of categoryFileList) {
    const channelListFile = JSON.parse(fs.readFileSync(`${categoryFilePath}/${fileName}`, 'utf8'));
    let apiCallCount = 1;
    let idField = "";

    for (const [index, item] of channelListFile.items.entries()) {

      /**
       * Gather channel name until it reaches 50 channels
       * */
      if(index < (apiCallCount * maxChannelLength) - 1 && index !== channelListFile.items.length - 1) {
        idField !== "" ?  idField = idField.concat(",", item.snippet.channelId) : idField = item.snippet.channelId;
      } else {

        let idFieldParam = "";
        if(index === channelListFile.items.length - 1) {
          idFieldParam = idField === "" ? item.snippet.channelId : idField.concat(",", item.snippet.channelId)
        } else {
          idFieldParam = idField.concat(",", item.snippet.channelId)
        }
        idField = "";
        apiCallCount++;

        /**
         * when it reaches 50 channels
         * */
        let category = channelListFile.title.replace(/ /g, "");

        if(!channelListStore.hasOwnProperty(category)) {
          channelListStore[category] = {}
          channelListStore[category].category = category;
          channelListStore[category].id = channelListFile.categoryId;
          channelListStore[category].type = categorySizeType;
          channelListStore[category].items = [];
        }

        let sendAjax = async (category, idField) => (
          await axios(axiosConfig(
            "GET",
            apiConfig.channelDetailInfoList,
            {
              part: "snippet, statistics",
              id: idField
            }
          ))
        );

        sendAjax(category, idFieldParam).then((response) => {
          channelListStore[category].items = channelListStore[category].items.concat(response.data.items)

          /**
           * channelListStore[category].items length and channelListFile.items.length
           * Length of two lists sometimes, does not guarantee to be identical (ex, Film&Animation and Entertainment)
           * To be ensure to write all list items "setTimeout" is used to write file
           * : when index matches last element, execute writing json file
           * */

          if(index === channelListFile.items.length - 1) {
            setTimeout(function() {
              let channelList = channelListStore[category];
              fs.writeFile(`${writtenFileDestination}/category_${category}.json`,
                JSON.stringify(channelList, null, 2), 'utf8', (err) => {
                  if (err) throw err;
                  console.log(`completed category_${category}.json file!`);
                });
            }, 3000)
          }
        }); // end send ajax
      }
    }

  }
};
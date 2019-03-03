const axios = require('axios');
const axiosConfig = require('../config/axiosConfig');
const apiConfig = require('../config/apiConfig');
const fs = require('fs');


exports.getLargeCategoryChannelListInfo = (req, res) => {
  const maxParamLength = 50;
  let maxApiCount = 0;
  let apiCallCount = 1;

  let apiParams = {
    part: "snippet,statistics",
    id: "",
  };

  let channelInfoList = {
    title: "",
    type: "",
    categoryId: "",
    items: []
  };

  fs.readdirSync('./json/youtubeApi/channelListInLargeCategory').forEach(file => {
    const channelList = JSON.parse(fs.readFileSync(`./json/youtubeApi/channelListInLargeCategory/${file}`, 'utf8'));
    maxApiCount = Math.ceil(channelList.items.length / maxParamLength); // Only 50 channels can be executed as params for one api call.

    channelList.items.forEach((item, index)=> {

      /**
       * gather channel ids to call api with.
       * */
      if(index < (apiCallCount * maxParamLength)) {
        if(apiParams.id !== "") {
          apiParams.id = apiParams.id.concat(",", item.snippet.channelId);
        } else {
          apiParams.id = item.snippet.channelId;
        }

      }

      /**
       * when it reaches 50 channel ids make an api call
       * */
      try {
        if(index === (apiCallCount * maxParamLength) - 1) {
          apiCallCount++;

          //TODO prevent apiParams.id length over 50

          // axios(axiosConfig(
          //   "GET",
          //   apiConfig.channelDetailInfoList,
          //   apiParams)).then((response) => {
          //   channelInfoList.items = channelInfoList.items.concat(response.data.items);
          //   apiParams.id = "";
          //   res.send(channelInfoList.items)
          //
          //   if(index === channelList.items.length -1) {
          //     writeJsonFile();
          //   }
          // });
          apiParams.id = "";
          console.log(apiParams)
        }
      } catch (error) {
        console.log(error);
      }


      /**
       * when it reaches last element write json file
       * */
      const writeJsonFile = () => {
        channelInfoList.title = channelList.title.replace(/ /g,""); // remove all spaces
        channelInfoList.type = "largeCategory";
        channelInfoList.categoryId = channelList.categoryId;

        fs.writeFile(`./json/youtubeApi/channelListWithStatistics/category_${channelInfoList.title}.json`,
          JSON.stringify(channelInfoList, null, 2), 'utf8', (err) => {
            if (err) throw err;
            console.log(`completed category_${channelInfoList.title}.json file!`);
          });
      }


    });
  });

};
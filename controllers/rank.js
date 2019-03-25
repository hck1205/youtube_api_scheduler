const fs = require('fs');

exports.rankAllChannels = (req, res) => {
  let largeCategroyFilesPath = './json/youtubeApi/channelListWithStatistics/largeCategory';
  let smallCategroyFilesPath = './json/youtubeApi/channelListWithStatistics/smallCategory';
  let writtenFileDestination = './json/youtubeChannelRank/all';

  let largeCategoryFileList = fs.readdirSync(largeCategroyFilesPath);
  let smallCategoryFileList = fs.readdirSync(smallCategroyFilesPath);

  let check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  let storeData = {
    channels: []
  };

  for (const file of largeCategoryFileList) {
    const channelList = JSON.parse(fs.readFileSync(`${largeCategroyFilesPath}/${file}`, 'utf8'));
    storeData.channels = storeData.channels.concat(
      channelList.items.filter((item) => {
        return item.snippet.country === "KR" || check.test(item.snippet.description);
      })
    )
  }

  for (const file of smallCategoryFileList) {
    const channelList = JSON.parse(fs.readFileSync(`${smallCategroyFilesPath}/${file}`, 'utf8'));
    storeData.channels = storeData.channels.concat(
      channelList.items.filter((item) => {
        return item.snippet.country === "KR" || item.snippet.country === undefined
      })
    )
  }

  let sortedStoreData = bubbleSort(storeData);

  res.send(sortedStoreData);
};

const bubbleSort = (storeData) => {

  let dataLength = storeData.channels.length;

  for(let i = 0; i < dataLength; i++) {
    for(let j = i + 1; j < dataLength; j++){
      if(Number(storeData.channels[i].statistics.subscriberCount) < Number(storeData.channels[j].statistics.subscriberCount)){
        let temp = storeData.channels[i];
        storeData.channels[i] = storeData.channels[j];
        storeData.channels[j] = temp;
      }
    }
  }
  return storeData
};

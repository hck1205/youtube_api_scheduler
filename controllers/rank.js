const fs = require('fs');

const bubbleSort = (objList) => {

  let dataLength = objList.items.length;

  for(let i = 0; i < dataLength; i++) {
    for(let j = i + 1; j < dataLength; j++){
      if(Number(objList.items[i].statistics.subscriberCount) < Number(objList.items[j].statistics.subscriberCount)){
        let temp = objList.items[i];
        objList.items[i] = objList.items[j];
        objList.items[j] = temp;
      }
    }
  }

  return objList
};


exports.rankAllChannels = (req, res) => {
  let largeCategroyFilesPath = './json/youtubeApi/channelListWithStatistics/largeCategory';
  let smallCategroyFilesPath = './json/youtubeApi/channelListWithStatistics/smallCategory';
  let writtenFileDestination = './json/youtubeChannelRank/all';

  let largeCategoryFileList = fs.readdirSync(largeCategroyFilesPath);
  let smallCategoryFileList = fs.readdirSync(smallCategroyFilesPath);

  /**
   * Filter channels that has no Korean characters in channel description
   * */
  let koreanRegEx = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

  let storeData = {
    items: []
  };

  for (const file of largeCategoryFileList) {
    const channelList = JSON.parse(fs.readFileSync(`${largeCategroyFilesPath}/${file}`, 'utf8'));
    storeData.items = storeData.items.concat(
      channelList.items.filter((item) => {
          return item.snippet.country === "KR" || koreanRegEx.test(item.snippet.description);
      })
    )
  }
  for (const file of smallCategoryFileList) {
    const channelList = JSON.parse(fs.readFileSync(`${smallCategroyFilesPath}/${file}`, 'utf8'));
    storeData.items = storeData.items.concat(
      channelList.items.filter((item) => {
        return item.snippet.country === "KR" || koreanRegEx.test(item.snippet.description);
      })
    )
  }

  /**
   * Remove duplicated Channel
   * */
  storeData.items = storeData.items.filter((channel, index, self) =>
    index === self.findIndex((c) => (
      c.id === channel.id
    ))
  );

  /**
   * Top 100 channels where has most subscribers in Korea
   * */
  let sortedStoreData = bubbleSort(storeData).items.slice(0, 100);

  fs.writeFile(`${writtenFileDestination}/top100Channels.json`,
    JSON.stringify(sortedStoreData, null, 2), 'utf8', (err) => {
      if (err) throw err;
      console.log(`completed top100Channels.json file!`);
    });
};

exports.rankByCategory = (req, res) => {

  let filesPath = '';
  let writtenFileDestination = '';
  let fileList;

  if(req.params.categoryType === "large") {
    filesPath = './json/youtubeApi/channelListWithStatistics/largeCategory';
    writtenFileDestination = './json/youtubeChannelRank/largeCategory';
    fileList = fs.readdirSync(filesPath);
  } else if(req.params.categoryType === "small") {
    filesPath = './json/youtubeApi/channelListWithStatistics/smallCategory';
    writtenFileDestination = './json/youtubeChannelRank/smallCategory';
    fileList = fs.readdirSync(filesPath);
  } else {
    res.send("You are not allowed to access");
  }

  /**
   * Filter channels that has no Korean characters in channel description
   * */
  let koreanRegEx = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  // let englishRegEx = /[a-z|A-Z]/;

  let musicData = {
    category: "Music",
    id: [18,19,20,21],
    type: "small",
    items: []
  };

  for (const file of fileList) {
    const channelList = JSON.parse(fs.readFileSync(`${filesPath}/${file}`, 'utf8'));

    channelList.items = channelList.items.filter((item) => {
        return item.snippet.country === "KR" || koreanRegEx.test(item.snippet.description);
    });

    /**
     * Music category needs to be combined with
     * several different categories
     * */
    if(channelList.category.includes("Music"))  {
      console.log(channelList.items.length)
      musicData.items = musicData.items.concat(channelList.items)
    } else {
      let sortedData = bubbleSort(channelList)

      if(sortedData.items.length > 100) {
        sortedData.items = sortedData.items.slice(0, 100);
      }

      fs.writeFile(`${writtenFileDestination}/${sortedData.category}.json`,
        JSON.stringify(sortedData, null, 2), 'utf8', (err) => {
          if (err) throw err;
          console.log(`completed ${sortedData.category}.json file!`);
        });
    }
  }

  fs.writeFile(`${writtenFileDestination}/${musicData.category}.json`,
    JSON.stringify(musicData, null, 2), 'utf8', (err) => {
      if (err) throw err;
      console.log(`completed ${musicData.category}.json file!`);
    });
};


const path = require("path");
const { getDoujinByFilepath, getAllDoujins } = require("../../repositories");
const { getUserConfigs } = require("../configuration");
const { getCompressedFilepaths, getFileStats } = require("../filesystem");

exports.postDoujinsUpdate = async () => {
  const userConfig = await getUserConfigs();
  const content_directory = userConfig?.content_directory;

  const filepaths = await getCompressedFilepaths(content_directory);

  for (const filepath of filepaths) {
    const fileStats = await getFileStats(filepath);

    const doujinEntry = getDoujinByFilepath(filepath);

    if (!doujinEntry) {
      createDoujinEntry({
        name: path.basename(filepath),
        filepath,
        tags: "",
        date_created: fileStats.birthtime.toISOString(),
        pagecount: (await getCompressedFileImages(filepath)).length,
        size: fileStats.size,
      });
    }
  }

  const doujins = getAllDoujins();

  return doujins;
};

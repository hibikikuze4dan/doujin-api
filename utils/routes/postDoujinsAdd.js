const path = require("path");
const {
  getDoujinByFilepath,
  getAllDoujins,
  createDoujinEntry,
} = require("../../repositories");
const { getUserConfigs } = require("../configuration");
const {
  getCompressedFilepaths,
  getFileStats,
  extractFirstImage,
  createThumbnail,
  deleteFile,
  getCompressedFileImages,
} = require("../filesystem");
const {
  TEMP_IMAGE_DIRECTORY_PATH,
  THUMBNAIL_IMAGE_DIRECTORY_PATH,
} = require("../../constants");

exports.postDoujinsAdd = async () => {
  try {
    const userConfig = await getUserConfigs();
    const content_directory = userConfig?.content_directory;

    const tempImageData = [];
    const filepaths = await getCompressedFilepaths(content_directory);

    for (const filepath of filepaths) {
      const fileStats = await getFileStats(filepath);

      const doujinEntry = getDoujinByFilepath(filepath);

      if (!doujinEntry) {
        const newRowId = createDoujinEntry({
          name: path.basename(filepath),
          filepath,
          tags: "",
          date_created: fileStats.birthtime.toISOString(),
          pagecount: (await getCompressedFileImages(filepath)).length,
          size: fileStats.size,
        });

        const tempImagePath = await extractFirstImage(
          filepath,
          TEMP_IMAGE_DIRECTORY_PATH,
        );

        if (tempImagePath) {
          tempImageData.push({ rowId: newRowId, imagePath: tempImagePath });
        }
      }
    }

    for (const data of tempImageData) {
      await createThumbnail(
        path.join(data?.imagePath),
        THUMBNAIL_IMAGE_DIRECTORY_PATH,
        {
          filename: data?.rowId,
          height: 500,
          prefix: "",
        },
      );

      await deleteFile(data?.imagePath);
    }

    const doujins = getAllDoujins();

    return doujins;
  } catch (error) {
    const doujins = getAllDoujins();
    return doujins;
  }
};

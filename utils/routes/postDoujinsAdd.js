const path = require("path");
const {
  getDoujinByFilepath,
  getAllDoujins,
  createDoujinEntry,
  getDoujinById,
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
const {
  getLanraragiDatabaseBackup,
  getLanraragiTagsByFilename,
} = require("../tagging");

exports.postDoujinsAdd = async () => {
  const newDoujins = [];

  try {
    const userConfig = await getUserConfigs();
    const content_directory = userConfig?.content_directory;

    let lanraragiBackupData = await getLanraragiDatabaseBackup();

    const archives = lanraragiBackupData?.archives;
    lanraragiBackupData = null;

    const newRowIds = [];
    const tempImageData = [];
    const filepaths = await getCompressedFilepaths(content_directory);

    for (const filepath of filepaths) {
      const fileStats = await getFileStats(filepath);

      const doujinEntry = getDoujinByFilepath(filepath);
      if (!doujinEntry) {
        const filename = path.basename(filepath);
        const filenameWithoutExtension = path.parse(filepath).name;
        const newRowId = createDoujinEntry({
          name: filename,
          filepath,
          tags: getLanraragiTagsByFilename({
            archives,
            filename: filenameWithoutExtension,
          }),
          date_created: fileStats.birthtime.toISOString(),
          pagecount: (await getCompressedFileImages(filepath)).length,
          size: fileStats.size,
        });

        const tempImagePath = await extractFirstImage(
          filepath,
          TEMP_IMAGE_DIRECTORY_PATH,
        );

        if (tempImagePath && newRowId) {
          newRowIds.push(newRowId);
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

    for (const id of newRowIds) {
      const doujin = getDoujinById(id);

      if (doujin) {
        newDoujins.push(doujin);
      }
    }

    return newDoujins;
  } catch (error) {
    return newDoujins;
  }
};

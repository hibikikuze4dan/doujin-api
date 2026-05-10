const path = require("path");
const { getUserConfigs } = require("../../utils/configuration");
const {
  getCompressedFilepaths,
  getFileStats,
  extractFirstImage,
  createThumbnail,
  deleteFile,
  getCompressedFileImages,
} = require("../../utils/filesystem");
const {
  TEMP_IMAGE_DIRECTORY_PATH,
  THUMBNAIL_IMAGE_DIRECTORY_PATH,
} = require("../../constants");
const {
  getLanraragiDatabaseBackup,
  getLanraragiTagsByFilename,
  getDoujinTags,
  createTagsDatabaseInsertArray,
} = require("../../utils/tagging");
const { createThumbnailForDoujin } = require("../../utils/doujins");
const { doujinsQueries, tagsQueries } = require("../../db");
const { getArchiveWithTags } = require("../../db-utils");

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

      const doujinEntry = doujinsQueries.getDoujinByFilepath(filepath);
      if (!doujinEntry) {
        const filename = path.basename(filepath);
        const filenameWithoutExtension = path.parse(filepath).name;

        let tags = "";

        if (archives) {
          tags = getLanraragiTagsByFilename({
            archives,
            filename: filenameWithoutExtension,
          });
        }

        if (!tags) {
          tags = await getDoujinTags(filepath);
        }

        const newRowId = doujinsQueries.createDoujinEntry({
          name: filename,
          filepath,
          date_created: fileStats.birthtime.toISOString(),
          pagecount: (await getCompressedFileImages(filepath)).length,
          size: fileStats.size,
        });

        newRowIds.push(newRowId);

        const tagsArray = createTagsDatabaseInsertArray(newRowId, tags);
        tagsQueries.addTags(tagsArray);

        await createThumbnailForDoujin(newRowId, filepath);
      }
    }

    for (const id of newRowIds) {
      const doujin = getArchiveWithTags(id);

      if (doujin) {
        newDoujins.push(doujin);
      }
    }

    return newDoujins;
  } catch (error) {
    return newDoujins;
  }
};

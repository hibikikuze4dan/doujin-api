const path = require("path");
const { getUserConfigs } = require("../../utils/configuration");
const {
  getCompressedFilepaths,
  getFileStats,
  getCompressedFileImages,
} = require("../../utils/filesystem");
const {
  getLanraragiDatabaseBackup,
  getLanraragiTagsByFilename,
  getArchiveTags,
  createTagsDatabaseInsertArray,
} = require("../../utils/tagging");
const { createThumbnailForArchive } = require("../../utils/archives");
const { archivesQueries, tagsQueries } = require("../../db");

exports.postArchivesAdd = async () => {
  const newArchives = [];

  try {
    const userConfig = await getUserConfigs();
    const content_directory = userConfig?.content_directory;

    let lanraragiBackupData = await getLanraragiDatabaseBackup();

    const archives = lanraragiBackupData?.archives;
    lanraragiBackupData = null;

    const newRowIds = [];
    const filepaths = await getCompressedFilepaths(content_directory);

    for (const filepath of filepaths) {
      const fileStats = await getFileStats(filepath);

      const archiveEntry = archivesQueries.getArchiveByFilepath(filepath);
      if (!archiveEntry) {
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
          tags = await getArchiveTags(filepath);
        }

        const newRowId = archivesQueries.createArchiveEntry({
          name: filename,
          filepath,
          date_created: fileStats.birthtime.toISOString(),
          pagecount: (await getCompressedFileImages(filepath)).length,
          size: fileStats.size,
        });

        newRowIds.push(newRowId);

        const tagsArray = createTagsDatabaseInsertArray(newRowId, tags);
        tagsQueries.addTags(tagsArray);

        await createThumbnailForArchive(newRowId, filepath);
      }
    }

    for (const id of newRowIds) {
      const archive = archivesQueries.getArchiveById(id);

      if (archive) {
        newArchives.push(archive);
      }
    }

    return newArchives;
  } catch {
    return newArchives;
  }
};

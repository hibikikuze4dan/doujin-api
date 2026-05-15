const path = require("path");
const { fileExists } = require("../../utils/filesystem");
const { THUMBNAIL_IMAGE_DIRECTORY_PATH } = require("../../constants");
const { createThumbnailForArchive } = require("../../utils");

exports.getArchivesIdThumbnail = async (
  archiveId = "",
  archiveFilepath = "",
) => {
  if (!archiveId || !archiveFilepath) {
    return "";
  }

  const archiveThumbnailImagePath = path.join(
    THUMBNAIL_IMAGE_DIRECTORY_PATH,
    `${archiveId}.jpeg`,
  );

  if (!(await fileExists(archiveThumbnailImagePath))) {
    await createThumbnailForArchive(archiveId, archiveFilepath);
  }

  return archiveThumbnailImagePath;
};

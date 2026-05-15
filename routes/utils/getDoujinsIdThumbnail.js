const path = require("path");
const { fileExists } = require("../../utils/filesystem");
const { THUMBNAIL_IMAGE_DIRECTORY_PATH } = require("../../constants");
const { createThumbnailForArchive } = require("../../utils");

exports.getDoujinsIdThumbnail = async (archiveId = "", doujinFilepath = "") => {
  if (!archiveId || !doujinFilepath) {
    return "";
  }

  const doujinThumbnailImagePath = path.join(
    THUMBNAIL_IMAGE_DIRECTORY_PATH,
    `${archiveId}.jpeg`,
  );

  if (!(await fileExists(doujinThumbnailImagePath))) {
    await createThumbnailForArchive(archiveId, doujinFilepath);
  }

  return doujinThumbnailImagePath;
};

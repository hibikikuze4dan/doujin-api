const path = require("path");
const { fileExists } = require("../../utils/filesystem");
const { THUMBNAIL_IMAGE_DIRECTORY_PATH } = require("../../constants");

exports.getDoujinsIdThumbnail = async (doujinId = "", doujinFilepath = "") => {
  if (!doujinId || !doujinFilepath) {
    return "";
  }

  const doujinThumbnailImagePath = path.join(
    THUMBNAIL_IMAGE_DIRECTORY_PATH,
    `${doujinId}.jpeg`,
  );

  if (!(await fileExists(doujinThumbnailImagePath))) {
    await createThumbnailForArchive(doujinId, doujinFilepath);
  }

  return doujinThumbnailImagePath;
};

const {
  TEMP_IMAGE_DIRECTORY_PATH,
  THUMBNAIL_IMAGE_DIRECTORY_PATH,
} = require("../../constants");
const {
  createThumbnail,
  extractFirstImage,
  deleteFile,
} = require("../filesystem");

exports.createThumbnailForArchive = async (archiveId, archiveFilepath) => {
  if (!archiveFilepath) {
    return null;
  }

  try {
    const tempImagePath = await extractFirstImage(
      archiveFilepath,
      TEMP_IMAGE_DIRECTORY_PATH,
    );

    const thumbnailPath = await createThumbnail(
      tempImagePath,
      THUMBNAIL_IMAGE_DIRECTORY_PATH,
      {
        filename: archiveId,
        height: 500,
        prefix: "",
      },
    );

    await deleteFile(tempImagePath);

    return thumbnailPath;
  } catch (error) {
    console.error(
      `Something went wrong while trying to create a thumbnail for the archive at ${archiveFilepath}:\n${error}`,
    );
    return null;
  }
};

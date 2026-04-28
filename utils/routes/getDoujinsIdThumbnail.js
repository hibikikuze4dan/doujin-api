exports.getDoujinsIdThumbnail = async (doujinId = "", doujinFilepath = "") => {
  if (!doujinId || !doujinFilepath) {
    return "";
  }

  const doujinThumbnailImagePath = path.join(
    THUMBNAIL_IMAGE_DIRECTORY_PATH,
    `${doujinId}.jpeg`,
  );

  if (!(await fileExists(doujinThumbnailImagePath))) {
    await createThumbnailForDoujin(doujinId, doujinFilepath);
  }

  return doujinThumbnailImagePath;
};

const path = require("path");
const {
  IMAGE_EXTENSIONS,
  ARCHIVE_IMAGES_DIRECTORY_PATH,
  IMAGE_NOT_FOUND_FILEPATH,
} = require("../../constants");
const {
  fileExists,
  unzipFileContents,
  createThumbnailForArchive,
} = require("../../utils");
const { archivesQueries } = require("../../db");

exports.getPublicImage = async ({
  archiveId = "",
  enableVerification = false,
  filename = "",
  isThumbnail = false,
  isArchiveImage = false,
} = {}) => {
  if ((!isThumbnail && !isArchiveImage) || !filename || !archiveId) {
    return IMAGE_NOT_FOUND_FILEPATH;
  }

  const isImageFile = IMAGE_EXTENSIONS.has(path.extname(filename));

  if (archiveId && filename && isImageFile) {
    const archiveImagesOutputDirectory = path.resolve(
      path.join(ARCHIVE_IMAGES_DIRECTORY_PATH, `${archiveId}`),
    );

    const doesFileExist = await fileExists(
      path.join(archiveImagesOutputDirectory, filename),
    );

    const shouldGetImage = enableVerification && !doesFileExist;

    if (shouldGetImage) {
      const archive = archivesQueries.getArchiveById(archiveId);

      if (isArchiveImage) {
        await unzipFileContents(
          archive?.filepath,
          archiveImagesOutputDirectory,
        );
      } else if (isThumbnail) {
        await createThumbnailForArchive(archive?.id, archive?.filepath);
      }
    }

    if (!enableVerification && !doesFileExist) {
      return IMAGE_NOT_FOUND_FILEPATH;
    }
  } else if (!isImageFile) {
    return IMAGE_NOT_FOUND_FILEPATH;
  }

  return null;
};

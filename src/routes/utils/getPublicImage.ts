import path from "path";
import {
  ARCHIVE_IMAGES_DIRECTORY_PATH,
  IMAGE_EXTENSIONS,
  IMAGE_NOT_FOUND_FILEPATH,
  THUMBNAIL_IMAGE_DIRECTORY_PATH,
} from "../../constants";
import {
  createThumbnailForArchive,
  fileExists,
  unzipFileContents,
} from "../../utils";
import { archivesQueries } from "../../db";

export const getPublicImage = async ({
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
    const imageDirectoryPathToUse = isThumbnail
      ? THUMBNAIL_IMAGE_DIRECTORY_PATH
      : ARCHIVE_IMAGES_DIRECTORY_PATH;

    const pathEnd = isThumbnail ? "" : `${archiveId}`;

    const archiveImagesOutputDirectory = path.resolve(
      path.join(imageDirectoryPathToUse, `${pathEnd}`),
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

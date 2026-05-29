import path from "path";
import { THUMBNAIL_IMAGE_DIRECTORY_PATH } from "../../constants";
import { createThumbnailForArchive, fileExists } from "../../utils";

export const getArchivesIdThumbnail = async (
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

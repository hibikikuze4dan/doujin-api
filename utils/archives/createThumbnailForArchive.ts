import {
  TEMP_IMAGE_DIRECTORY_PATH,
  THUMBNAIL_IMAGE_DIRECTORY_PATH,
} from "../../constants";
import { createThumbnail, extractFirstImage, deleteFile } from "../filesystem";

export const createThumbnailForArchive = async (
  archiveId: string,
  archiveFilepath: string,
): Promise<string | null> => {
  if (!archiveFilepath || !archiveId) {
    return null;
  }

  try {
    const tempImagePath = await extractFirstImage(
      archiveFilepath,
      TEMP_IMAGE_DIRECTORY_PATH,
    );

    if (!tempImagePath) {
      return null;
    }

    const thumbnailPath = await createThumbnail(
      tempImagePath,
      THUMBNAIL_IMAGE_DIRECTORY_PATH,
      {
        filename: archiveId,
        height: 500,
        prefix: "",
      },
    );

    if (!thumbnailPath) {
      return null;
    }

    await deleteFile(tempImagePath);

    return thumbnailPath;
  } catch (error) {
    console.error(
      `Something went wrong while trying to create a thumbnail for the archive at ${archiveFilepath}:\n${error}`,
    );
    return null;
  }
};

import path from "path";
import { archivesQueries, historyQueries } from "../../db";
import { ARCHIVE_IMAGES_DIRECTORY_PATH } from "../../constants";
import {
  deleteFolderContents,
  getImageFiles,
  unzipFileContents,
} from "../../utils";

export const getArchivesIdPages = async (id: number) => {
  if (!id) {
    return [];
  }

  try {
    const archive = archivesQueries.getArchiveById(id);
    const archiveImagesOutputDirectory = path.resolve(
      path.join(ARCHIVE_IMAGES_DIRECTORY_PATH, `${id}`),
    );

    if (archive) {
      await deleteFolderContents(archiveImagesOutputDirectory);
      await unzipFileContents(archive?.filepath, archiveImagesOutputDirectory);
      const imageFiles = await getImageFiles(archiveImagesOutputDirectory);

      const imageLinks = imageFiles.map((file) => {
        return path.join("/", "images", "archive", `${id}`, file.name);
      });

      historyQueries.createHistoryEntry({
        archive_id: archive.id,
        last_page: 1,
      });
      return imageLinks;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

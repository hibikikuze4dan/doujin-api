const path = require("path");
const { ARCHIVE_IMAGES_DIRECTORY_PATH } = require("../../constants");
const {
  deleteFolderContents,
  unzipFileContents,
  getImageFiles,
} = require("../../utils/filesystem");
const { archivesQueries, historyQueries } = require("../../db");

exports.getArchivesIdPages = async (id) => {
  if (!id) {
    return [];
  }

  try {
    const archive = archivesQueries.getArchiveById(id);
    const archiveImagesOutputDirectory = path.resolve(
      path.join(ARCHIVE_IMAGES_DIRECTORY_PATH, `${id}`),
    );

    await deleteFolderContents(archiveImagesOutputDirectory);
    await unzipFileContents(archive?.filepath, archiveImagesOutputDirectory);
    const imageFiles = await getImageFiles(archiveImagesOutputDirectory);

    const imageLinks = imageFiles.map((file) => {
      return path.join("/", "images", "archive", `${id}`, file.name);
    });

    historyQueries.createHistoryEntry({
      archive_id: archive?.id,
      last_page: 1,
    });
    return imageLinks;
  } catch {
    return [];
  }
};

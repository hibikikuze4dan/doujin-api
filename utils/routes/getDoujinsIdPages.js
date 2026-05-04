const path = require("path");
const { DOUJIN_IMAGES_DIRECTORY_PATH } = require("../../constants");
const {
  deleteFolderContents,
  unzipFileContents,
  getImageFiles,
} = require("../filesystem");
const { doujinsQueries, historyQueries } = require("../../db");

exports.getDoujinsIdPages = async (id) => {
  if (!id) {
    return [];
  }

  try {
    const doujin = doujinsQueries.getDoujinById(id);
    const doujinImagesOutputDirectory = path.join(
      DOUJIN_IMAGES_DIRECTORY_PATH,
      `${id}`,
    );

    await deleteFolderContents(doujinImagesOutputDirectory);
    await unzipFileContents(doujin?.filepath, doujinImagesOutputDirectory);
    const imageFiles = await getImageFiles(doujinImagesOutputDirectory);

    const imageLinks = imageFiles.map((file) => {
      return path.join("/", "images", "doujin", `${id}`, file.name);
    });

    historyQueries.createHistoryEntry({ doujin_id: doujin?.id, last_page: 1 });
    return imageLinks;
  } catch (error) {
    return [];
  }
};

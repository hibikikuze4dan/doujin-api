const path = require("path");
const { DOUJIN_IMAGES_DIRECTORY_PATH } = require("../../constants");
const { getDoujinById } = require("../../repositories");
const {
  deleteFolderContents,
  unzipFileContents,
  getImageFiles,
} = require("../filesystem");

exports.getDoujinsIdPages = async (id) => {
  if (!id) {
    return [];
  }

  try {
    const doujin = getDoujinById(id);

    await deleteFolderContents(DOUJIN_IMAGES_DIRECTORY_PATH);
    await unzipFileContents(doujin?.filepath, DOUJIN_IMAGES_DIRECTORY_PATH);
    const imageFiles = await getImageFiles(DOUJIN_IMAGES_DIRECTORY_PATH);

    const imageLinks = imageFiles.map((file) => {
      return path.join("/", "images", "doujin", file.name);
    });

    return imageLinks;
  } catch (error) {
    return [];
  }
};

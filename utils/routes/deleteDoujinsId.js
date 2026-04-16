const { getDoujinById, removeDoujinEntry } = require("../../repositories");
const { deleteFile } = require("../filesystem");

exports.deleteDoujinsId = async (id, shouldDeleteFile = false) => {
  if (!id) {
    return null;
  }

  const doujin = getDoujinById(id);
  const removalSuccessful = removeDoujinEntry(id);

  if (removalSuccessful && shouldDeleteFile) {
    await deleteFile(doujin?.filepath);
  }

  return doujin ?? null;
};

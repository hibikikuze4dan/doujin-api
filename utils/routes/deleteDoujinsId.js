const { doujinsQueries } = require("../../db");
const { deleteFile } = require("../filesystem");

exports.deleteDoujinsId = async (id, shouldDeleteFile = false) => {
  if (!id) {
    return null;
  }

  const doujin = doujinsQueries.getDoujinById(id);
  const removalSuccessful = doujinsQueries.removeDoujinEntry(id);

  if (removalSuccessful && shouldDeleteFile) {
    await deleteFile(doujin?.filepath);
  }

  return doujin ?? null;
};

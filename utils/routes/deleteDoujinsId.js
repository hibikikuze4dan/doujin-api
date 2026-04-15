const { getDoujinById, removeDoujinEntry } = require("../../repositories");
const { deleteFile: deleteFileUtility } = require("../");

exports.deleteDoujinsId = async (id, deleteFile = false) => {
  if (!id) {
    return null;
  }

  const doujin = getDoujinById(id);
  const removalSuccessful = removeDoujinEntry(id);

  if (removalSuccessful && deleteFile) {
    await deleteFileUtility(doujin?.filepath);
  }

  return doujin ?? null;
};

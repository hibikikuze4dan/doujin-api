const { doujinsQueries } = require("../../db");
const { getArchiveWithTags } = require("../database");
const { deleteFile } = require("../filesystem");

exports.deleteDoujinsId = async (id, shouldDeleteFile = false) => {
  if (!id) {
    return null;
  }

  const doujin = getArchiveWithTags(id);
  const removalSuccessful = doujinsQueries.removeDoujinEntry(id);

  if (removalSuccessful && shouldDeleteFile) {
    await deleteFile(doujin?.filepath);
  }

  return doujin ?? null;
};

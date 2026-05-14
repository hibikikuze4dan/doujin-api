const { doujinsQueries } = require("../../db");
const { getArchiveWithTags } = require("../../db-utils");
const { deleteFile } = require("../../utils/filesystem");

exports.deleteDoujinsId = async (id, shouldDeleteFile = false) => {
  if (!id) {
    return null;
  }

  const doujin = getArchiveWithTags(id);
  const removalSuccessful = doujinsQueries.removeArchiveEntry(id);

  if (removalSuccessful && shouldDeleteFile) {
    await deleteFile(doujin?.filepath);
  }

  return doujin ?? null;
};

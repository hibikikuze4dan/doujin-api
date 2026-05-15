const { archivesQueries } = require("../../db");
const { getArchiveWithTags } = require("../../db-utils");
const { deleteFile } = require("../../utils/filesystem");

exports.deleteArchivesId = async (id, shouldDeleteFile = false) => {
  if (!id) {
    return null;
  }

  const archive = getArchiveWithTags(id);
  const removalSuccessful = archivesQueries.removeArchiveEntry(id);

  if (removalSuccessful && shouldDeleteFile) {
    await deleteFile(archive?.filepath);
  }

  return archive ?? null;
};

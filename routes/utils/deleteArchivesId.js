const { archivesQueries } = require("../../db");
const { deleteFile } = require("../../utils/filesystem");

exports.deleteArchivesId = async (id, shouldDeleteFile = false) => {
  if (!id) {
    return null;
  }

  const archive = archivesQueries.getArchiveById(id);
  const removalSuccessful = archivesQueries.removeArchiveEntry(id);

  if (removalSuccessful && shouldDeleteFile) {
    await deleteFile(archive?.filepath);
  }

  return archive ?? null;
};

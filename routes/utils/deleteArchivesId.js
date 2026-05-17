const { archivesQueries } = require("../../db");
const { getArchiveWithTableData } = require("../../db-utils");
const { deleteFile } = require("../../utils/filesystem");

exports.deleteArchivesId = async (id, shouldDeleteFile = false) => {
  if (!id) {
    return null;
  }

  const archive = getArchiveWithTableData(id);
  const removalSuccessful = archivesQueries.removeArchiveEntry(id);

  if (removalSuccessful && shouldDeleteFile) {
    await deleteFile(archive?.filepath);
  }

  return archive ?? null;
};

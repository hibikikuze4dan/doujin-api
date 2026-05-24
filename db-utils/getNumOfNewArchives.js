const { getCompressedFilepaths } = require("../utils");
const { archivesQueries } = require("../db");

exports.getNumOfNewArchives = ({ contentDirectory = "" } = {}) => {
  if (!contentDirectory) {
    return 0;
  }

  const compressedFilepaths = getCompressedFilepaths(contentDirectory);

  const count =
    archivesQueries.getNumberOfNewArchivesByFilepaths(compressedFilepaths);

  return count;
};

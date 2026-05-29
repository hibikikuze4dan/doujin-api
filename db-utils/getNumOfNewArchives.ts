import { archivesQueries } from "../db";
import { getCompressedFilepaths } from "../utils";

export const getNumOfNewArchives = async ({ contentDirectory = "" } = {}) => {
  if (!contentDirectory) {
    return 0;
  }

  const compressedFilepaths = await getCompressedFilepaths(contentDirectory);

  const count =
    archivesQueries.getNumberOfNewArchivesByFilepaths(compressedFilepaths);

  return count;
};

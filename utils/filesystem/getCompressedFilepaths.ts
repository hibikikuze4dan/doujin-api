import path from "path";
import { getCompressedFiles } from "./getCompressedFiles";

export const getCompressedFilepaths = async (dirpath = "") => {
  if (!dirpath) {
    return [];
  }

  try {
    const compressedFiles = await getCompressedFiles(dirpath);
    const filepaths = compressedFiles.map((file) => {
      return path.join(file.parentPath, file.name);
    });

    return filepaths;
  } catch (error) {
    console.error(
      `Error occured while trying to get compressed file filepaths:\n${error}`,
    );
    return [];
  }
};

module.exports = {
  getCompressedFilepaths,
};

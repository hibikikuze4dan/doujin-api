const path = require("path");

const { COMPRESSED_EXTENSIONS } = require("../../constants");
const { getFiles } = require("./getFiles");

exports.getCompressedFiles = async (dirpath = "") => {
  if (!dirpath) {
    return [];
  }

  try {
    const files = await getFiles(dirpath);
    const filteredFiles = files.filter((file) => {
      const isCompressedFile = COMPRESSED_EXTENSIONS.has(
        path.extname(file.name).toLowerCase(),
      );
      return file.isFile && isCompressedFile;
    });

    return filteredFiles;
  } catch (error) {
    console.error(
      `Error occured while trying to get compressed files:\n${error}`,
    );
    return [];
  }
};

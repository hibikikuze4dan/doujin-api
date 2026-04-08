const path = require("path");
const { IMAGE_EXTENSIONS } = require("../../constants");
const { getCompressedFileEntries } = require("./getCompressedFileEntries");

exports.getCompressedFileImages = async (filepath = "") => {
  if (!filepath) {
    return [];
  }

  try {
    const entries = await getCompressedFileEntries(filepath);

    const imageFiles = Object.values(entries).filter((entry) => {
      const isFile = !entry?.isDirectory;
      const entryName = entry?.name ?? "";
      const isImage = IMAGE_EXTENSIONS.has(
        path.extname(entryName).toLowerCase(),
      );

      return isFile && isImage;
    });

    return imageFiles;
  } catch (error) {
    console.error(
      `Something went wrong while trying to get the image files of compressed file ${filepath}:\n${error}`,
    );
    return [];
  }
};

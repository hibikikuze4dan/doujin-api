const path = require("path");
const { IMAGE_EXTENSIONS } = require("../../constants");
const { getFiles } = require("./getFiles");

const DEFAULT_OPTIONS = {
  withFileTypes: true,
  recursive: true,
};

exports.getImageFiles = async (dirpath = "", options = DEFAULT_OPTIONS) => {
  if (!dirpath) {
    return [];
  }

  try {
    const files = await getFiles(dirpath, { ...DEFAULT_OPTIONS, ...options });

    const imageFiles = files.filter((file) =>
      IMAGE_EXTENSIONS.has(path.extname(file.name).toLowerCase()),
    );

    return imageFiles;
  } catch (error) {
    console.error(`Error occured while trying to get image files:\n${error}`);
    return [];
  }
};

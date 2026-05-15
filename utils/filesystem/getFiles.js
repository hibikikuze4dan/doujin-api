const fs = require("fs/promises");

const DEFAULT_OPTIONS = {
  withFileTypes: true,
  recursive: true,
};

exports.getFiles = async (dirpath = "", options = DEFAULT_OPTIONS) => {
  if (!dirpath) {
    return [];
  }

  try {
    const files = await fs.readdir(dirpath, {
      ...DEFAULT_OPTIONS,
      ...options,
    });

    return files;
  } catch (error) {
    console.error(`Error occured while trying to get files:\n${error}`);
    return [];
  }
};

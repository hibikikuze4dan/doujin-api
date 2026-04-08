const fs = require("fs/promises");

const DEFAULT_OPTIONS = {
  recursive: true,
};

exports.createDirectory = async (
  folderpath = "",
  options = DEFAULT_OPTIONS,
) => {
  if (!folderpath) {
    return;
  }

  try {
    await fs.mkdir(folderpath, { ...DEFAULT_OPTIONS, ...options });
  } catch (error) {
    console.error(
      `Something went wrong when trying to create folder ${folderpath}:\n${error}`,
    );
    return;
  }
};

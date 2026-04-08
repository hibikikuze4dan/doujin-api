const fs = require("fs/promises");

exports.deleteFile = async (filepath = "") => {
  if (!filepath) {
    return;
  }

  try {
    await fs.unlink(filepath);
    return;
  } catch (error) {
    console.error(
      `Error occured while attempting to delete file ${filepath}:\n${error}`,
    );
    return;
  }
};

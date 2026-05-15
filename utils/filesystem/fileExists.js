const fs = require("fs/promises");

exports.fileExists = async (filepath = "") => {
  if (!filepath) {
    return false;
  }

  try {
    await fs.access(filepath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

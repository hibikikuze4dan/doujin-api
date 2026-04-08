const fs = require("fs/promises");

exports.getFileStats = async (filepath = "") => {
  if (!filepath) {
    return null;
  }

  try {
    const stats = await fs.stat(filepath);
    return stats;
  } catch (error) {
    console.error(
      `Something went wrong while trying to get the stats for file ${filepath}:\n${error}`,
    );
    return null;
  }
};

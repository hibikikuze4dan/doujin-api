const fs = require("fs/promises");

exports.readFile = async (filepath = "") => {
  if (!filepath) {
    return "";
  }

  try {
    const data = await fs.readFile(filepath, { encoding: "utf-8" });
    return data;
  } catch (error) {
    console.error(
      `Error occurred while trying to read the content of ${filepath}:\n${error}`,
    );
    return "";
  }
};

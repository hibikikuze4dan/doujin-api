const { readFile } = require("./readFile");

exports.readJSONFile = async (filepath = "") => {
  if (!filepath) {
    return {};
  }

  try {
    const data = JSON.parse(await readFile(filepath));
    return data;
  } catch (error) {
    console.error(
      `Error occurred while trying to read the content of ${filepath}:\n${error}`,
    );
    return {};
  }
};

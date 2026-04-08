const fs = require("fs/promises");

const DEFAULT_OPTIONS = {
  flag: "w+",
};

exports.createFile = async (
  filepath = "",
  data = "",
  options = DEFAULT_OPTIONS,
) => {
  if (!filepath) {
    return;
  }

  try {
    await fs.writeFile(filepath, data, { ...DEFAULT_OPTIONS, ...options });
  } catch (error) {
    console.error(
      `Something went wrong when trying to create file ${filepath}:\n${error}`,
    );
    return;
  }
};

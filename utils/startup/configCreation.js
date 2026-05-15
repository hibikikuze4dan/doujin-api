const {
  CONFIG_DIR,
  CONFIG_FILEPATH,
  CONFIG_DEFAULTS,
} = require("../../constants");
const { createDirectory, createFile, fileExists } = require("../filesystem");

exports.configCreation = async () => {
  await createDirectory(CONFIG_DIR);

  const configFileExists = await fileExists(CONFIG_FILEPATH);
  if (!configFileExists) {
    await createFile(CONFIG_FILEPATH, JSON.stringify(CONFIG_DEFAULTS));
  }
};

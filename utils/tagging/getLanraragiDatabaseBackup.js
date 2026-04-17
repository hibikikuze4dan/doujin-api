const { getUserConfigs } = require("../configuration");
const { readJSONFile } = require("../filesystem");

exports.getLanraragiDatabaseBackup = async () => {
  const config = await getUserConfigs();
  const filepath = config?.lrr_database_backup_path ?? "";

  if (!filepath) {
    return null;
  }

  try {
    const data = await readJSONFile(filepath);

    return data;
  } catch (error) {
    console.error(
      `Something went wrong while trying to get the lanraragi backup file:\n${error}`,
    );
    return null;
  }
};

import { getUserConfigs } from "../configuration";
import { readJSONFile } from "../filesystem";

export const getLanraragiDatabaseBackup = async () => {
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

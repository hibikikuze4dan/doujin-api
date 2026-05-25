import { CONFIG_DEFAULTS, CONFIG_DIR, CONFIG_FILEPATH } from "../../constants";
import { createDirectory, createFile, fileExists } from "../filesystem";

export const configCreation = async () => {
  await createDirectory(CONFIG_DIR);

  const configFileExists = await fileExists(CONFIG_FILEPATH);
  if (!configFileExists) {
    await createFile(CONFIG_FILEPATH, JSON.stringify(CONFIG_DEFAULTS));
  }
};

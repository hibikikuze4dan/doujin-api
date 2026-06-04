import { type MakeDirectoryOptions } from "fs";
import fs from "fs/promises";
import { logger } from "../logs";

const DEFAULT_OPTIONS = {
  recursive: true,
};

export const createDirectory = async (
  folderpath = "",
  options = DEFAULT_OPTIONS as Partial<MakeDirectoryOptions>,
) => {
  if (!folderpath) {
    return false;
  }

  try {
    await fs.mkdir(folderpath, { ...DEFAULT_OPTIONS, ...options });
    return true;
  } catch (error) {
    logger.error(
      `Something went wrong when trying to create folder ${folderpath}:\n${error}`,
    );
    return false;
  }
};

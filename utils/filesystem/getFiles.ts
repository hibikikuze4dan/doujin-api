import fs from "fs/promises";

export type GetFilesOptions = {
  encoding: "utf-8";
  withFileTypes: true;
  recursive: boolean;
};

const DEFAULT_OPTIONS = {
  encoding: "utf-8",
  withFileTypes: true,
  recursive: true,
} as GetFilesOptions;

export const getFiles = async (dirpath = "", options = DEFAULT_OPTIONS) => {
  if (!dirpath) {
    return [];
  }

  try {
    const files = await fs.readdir(dirpath, {
      ...DEFAULT_OPTIONS,
      ...options,
    });

    return files;
  } catch (error) {
    console.error(`Error occured while trying to get files:\n${error}`);
    return [];
  }
};

import fs from "fs/promises";

const DEFAULT_OPTIONS = {
  recursive: true,
};

export const createDirectory = async (
  folderpath = "",
  options = DEFAULT_OPTIONS,
) => {
  if (!folderpath) {
    return false;
  }

  try {
    await fs.mkdir(folderpath, { ...DEFAULT_OPTIONS, ...options });
    return true;
  } catch (error) {
    console.error(
      `Something went wrong when trying to create folder ${folderpath}:\n${error}`,
    );
    return false;
  }
};

import fs from "fs/promises";

const DEFAULT_OPTIONS = {
  flag: "w+",
};

export const createFile = async (
  filepath = "",
  data = "",
  options = DEFAULT_OPTIONS,
) => {
  if (!filepath) {
    return false;
  }

  try {
    await fs.writeFile(filepath, data, { ...DEFAULT_OPTIONS, ...options });
    return true;
  } catch (error) {
    console.error(
      `Something went wrong when trying to create file ${filepath}:\n${error}`,
    );
    return false;
  }
};

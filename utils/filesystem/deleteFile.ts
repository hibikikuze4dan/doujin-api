import fs from "fs/promises";

export const deleteFile = async (filepath = "") => {
  if (!filepath) {
    return false;
  }

  try {
    await fs.unlink(filepath);
    return true;
  } catch (error) {
    console.error(
      `Error occured while attempting to delete file ${filepath}:\n${error}`,
    );
    return false;
  }
};

import fs from "fs/promises";

export const fileExists = async (filepath = "") => {
  if (!filepath) {
    return false;
  }

  try {
    await fs.access(filepath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

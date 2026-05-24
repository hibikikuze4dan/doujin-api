import path from "path";

import { deleteFile } from "./deleteFile";
import { getFiles } from "./getFiles";

export const deleteFolderContents = async (folderpath = "") => {
  if (!folderpath) {
    return false;
  }

  try {
    const files = await getFiles(folderpath);

    for (const file of files) {
      const filepath = path.join(file.parentPath, file.name);
      await deleteFile(filepath);
    }

    return true;
  } catch (error) {
    console.error(
      `Error occured while trying to delete the contents of folder ${folderpath}:\n${error}`,
    );
    return false;
  }
};

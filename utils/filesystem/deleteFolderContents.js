const path = require("path");
const { deleteFile } = require("./deleteFile");
const { getFiles } = require("./getFiles");

exports.deleteFolderContents = async (folderpath = "") => {
  if (!folderpath) {
    return;
  }

  try {
    const files = await getFiles(folderpath);

    for (const file of files) {
      const filepath = path.join(file.parentPath, file.name);
      await deleteFile(filepath);
    }

    return;
  } catch (error) {
    console.error(
      `Error occured while trying to delete the contents of folder ${folderpath}:\n${error}`,
    );
    return;
  }
};

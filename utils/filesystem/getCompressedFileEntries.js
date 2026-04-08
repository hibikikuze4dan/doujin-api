const StreamZip = require("node-stream-zip");

exports.getCompressedFileEntries = async (filepath = "") => {
  if (!filepath) {
    return [];
  }

  let zip;
  let entries = [];

  try {
    zip = new StreamZip.async({ file: filepath });
    entries = await zip?.entries();

    return entries;
  } catch (error) {
    console.error(
      `Something went wrong while trying to get the contents of compressed file ${filepath}:\n${error}`,
    );
    return [];
  } finally {
    zip?.close();
  }
};

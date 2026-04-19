const StreamZip = require("node-stream-zip");

exports.getCompressedFileEntryBufferString = async (filepath = "", entry) => {
  if (!filepath || !entry) {
    return null;
  }

  try {
    const zip = new StreamZip.async({ file: archivePath });

    const buffer = await zip.entryData(entry.name);
    await zip.close();

    const text = buffer.toString("utf-8");

    return text;
  } catch (err) {
    console.error(
      `Something went wrong while trying to get a buffer from compressed file ${filepath}:\n${err}`,
    );
    return null;
  }
};

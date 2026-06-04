import StreamZip from "node-stream-zip";

export const getCompressedFileEntryBufferString = async (
  filepath = "",
  entry?: { name: string },
) => {
  if (!filepath || !entry) {
    return null;
  }

  try {
    const zip = new StreamZip.async({
      file: filepath,
      skipEntryNameValidation: true,
    });

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

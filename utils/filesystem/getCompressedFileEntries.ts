import StreamZip from "node-stream-zip";
import { type StreamZipEntries } from "../../types/general";

export const getCompressedFileEntries = async (
  filepath = "",
): Promise<StreamZipEntries> => {
  if (!filepath) {
    return {};
  }

  let zip;

  try {
    zip = new StreamZip.async({ file: filepath });
    const entries = await zip?.entries();

    return entries;
  } catch (error) {
    console.error(
      `Something went wrong while trying to get the contents of compressed file ${filepath}:\n${error}`,
    );
    return {};
  } finally {
    await zip?.close();
  }
};

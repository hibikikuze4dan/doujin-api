import StreamZip from "node-stream-zip";

import { createDirectory } from "./createDirectory";

export const unzipFileContents = async (
  filepath = "",
  outputdir = "",
  _options = {},
) => {
  if (!filepath || !outputdir) {
    return false;
  }

  let zip;

  try {
    await createDirectory(outputdir, { recursive: true });

    zip = new StreamZip.async({ file: filepath });

    const filecount = await zip.extract(null, outputdir);

    console.log(`Extracted ${filecount} files for ${filepath}`);

    await zip.close();

    return true;
  } catch (error) {
    console.error(
      `Something went wrong while trying to extract the contents of ${filepath}:\n${error}`,
    );

    await zip?.close();
    return false;
  }
};

const StreamZip = require("node-stream-zip");

exports.unzipFileContents = async (
  filepath = "",
  outputdir = "",
  _options = {},
) => {
  if (!filepath || !outputdir) {
    return;
  }

  try {
    const zip = new StreamZip.async({ file: filepath });

    const filecount = await zip.extract(null, outputdir);

    console.log(`Extracted ${filecount} files for ${filepath}`);

    await zip.close();

    return;
  } catch (error) {
    console.error(
      `Something went wrong while trying to extract the contents of ${filepath}:\n${error}`,
    );
    return;
  }
};

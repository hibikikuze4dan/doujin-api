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
    const zip = new StreamZip({ file: filepath });

    zip.on("ready", () => {
      zip.extract(null, outputdir, (err, count) => {
        console.log(
          err
            ? `Extract error for ${filepath}:\n${err}`
            : `Extracted ${count} files for ${filepath}`,
        );
        zip.close();
      });
    });

    return;
  } catch (error) {
    console.error(
      `Something went wrong while trying to extract the contents of ${filepath}:\n${error}`,
    );
    return;
  }
};

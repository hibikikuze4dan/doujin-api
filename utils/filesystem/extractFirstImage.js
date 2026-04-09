const path = require("path");
const StreamZip = require("node-stream-zip");
const { createDirectory } = require("./createDirectory");
const { getCompressedFileEntries } = require("./getCompressedFileEntries");
const { IMAGE_EXTENSIONS } = require("../../constants");

exports.extractFirstImage = async (filepath = "", outputDir = "") => {
  if (!outputDir || !filepath) {
    return null;
  }

  let zip;

  try {
    const resolvedOutputDir = path.resolve(outputDir);

    await createDirectory(resolvedOutputDir, { recursive: true });

    zip = new StreamZip.async({ file: filepath });

    const entries = await getCompressedFileEntries(filepath);

    const firstImage = Object.values(entries).find((entry) => {
      const ext = path.extname(entry?.name).toLowerCase();
      return !entry?.isDirectory && IMAGE_EXTENSIONS.has(ext);
    });

    if (!firstImage) {
      console.log("No image files found in the archive.");
      return null;
    }

    const outputFileName = path.basename(firstImage?.name);
    const outputPath = path.join(resolvedOutputDir, outputFileName);

    await zip.extract(firstImage.name, outputPath);
    console.log(`Extracted: ${firstImage?.name} → ${outputPath}`);

    return outputPath;
  } catch (error) {
    console.error(
      `Something went wrong while trying to extract an image from the archive at ${filepath}:\n${error}`,
    );
    return null;
  } finally {
    await zip?.close();
  }
};

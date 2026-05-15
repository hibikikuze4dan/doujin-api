const sharp = require("sharp");
const path = require("path");
const { createDirectory } = require("./createDirectory");

exports.createThumbnail = async (imagePath, outputDir, options = {}) => {
  const {
    height = 200,
    width = null,
    prefix = "thumb_",
    quality = 80,
    filename = "",
  } = options;

  if (!imagePath || !outputDir) {
    return null;
  }

  try {
    await createDirectory(outputDir, { recursive: true });

    const imageFilename = filename ? filename : path.basename(imagePath);
    const outputThumbnailPath = path.join(
      outputDir,
      `${prefix}${imageFilename}.jpeg`,
    );

    await sharp(imagePath)
      .resize(width, height, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality })
      .toFile(outputThumbnailPath);

    return outputThumbnailPath;
  } catch (error) {
    console.error(
      `Something went wrong while trying to create a thumbnail for image at ${imagePath}:\n${error}`,
    );
    return null;
  }
};

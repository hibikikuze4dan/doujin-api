import path from "path";
import sharp, { type ResizeOptions } from "sharp";
import { createDirectory } from "./createDirectory";

type CreateThumbnailOptions = {
  height?: number;
  width?: number;
  prefix?: string;
  quality?: number;
  filename?: string;
} & ResizeOptions;

const CREATE_THUMBNAIL_OPTION_DEFAULTS: CreateThumbnailOptions = {
  height: 200,
  prefix: "thumb_",
  quality: 80,
  filename: "",
};

export const createThumbnail = async (
  imagePath: string,
  outputDir: string,
  options = CREATE_THUMBNAIL_OPTION_DEFAULTS,
) => {
  const { filename, prefix, quality, height, width, ...otherResizeOptions } =
    options;

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
        ...otherResizeOptions,
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

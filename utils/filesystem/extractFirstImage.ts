import path from "path";
import StreamZip from "node-stream-zip";
import { createDirectory } from "./createDirectory";
import { getCompressedFileEntries } from "./getCompressedFileEntries";
import { IMAGE_EXTENSIONS } from "../../constants";

export const extractFirstImage = async (filepath = "", outputDir = "") => {
  if (!outputDir || !filepath) {
    return null;
  }

  let zip;

  try {
    const resolvedOutputDir = path.resolve(outputDir);

    await createDirectory(resolvedOutputDir, { recursive: true });

    zip = new StreamZip.async({
      file: filepath,
      skipEntryNameValidation: true,
    });

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
    const imageOutputPath = path.join(resolvedOutputDir, outputFileName);

    await zip.extract(firstImage.name, imageOutputPath);
    console.log(`Extracted: ${firstImage?.name} → ${imageOutputPath}`);

    return imageOutputPath;
  } catch (error) {
    console.error(
      `Something went wrong while trying to extract an image from the archive at ${filepath}:\n${error}`,
    );
    return null;
  } finally {
    await zip?.close();
  }
};

import path from "path";
import { IMAGE_EXTENSIONS } from "../../constants";
import { getFiles, type GetFilesOptions } from "./getFiles";

const DEFAULT_OPTIONS = {
  encoding: "utf-8",
  withFileTypes: true,
  recursive: true,
} as GetFilesOptions;

export const getImageFiles = async (
  dirpath = "",
  options = DEFAULT_OPTIONS,
) => {
  if (!dirpath) {
    return [];
  }

  try {
    const files = await getFiles(dirpath, { ...DEFAULT_OPTIONS, ...options });

    const imageFiles = files.filter((file) =>
      IMAGE_EXTENSIONS.has(path.extname(file.name).toLowerCase()),
    );

    return imageFiles;
  } catch (error) {
    console.error(`Error occured while trying to get image files:\n${error}`);
    return [];
  }
};

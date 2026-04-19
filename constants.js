const path = require("path");
const os = require("os");

const APP_NAME = "DoujinApi";

const APP_DATA = process.env.APP_DATA;

const CONFIG_DEFAULTS = {
  content_directory: "",
  lrr_database_backup_path: "",
  thumbnail_directory: "",
  tagging: [
    {
      name: "gallery-dl",
      filename: "info.json",
      data: ["tags", "eh_category", "language"],
    },
    {
      name: "HDoujin Downloader - tags.txt",
      filename: "tags.txt",
    },
    {
      name: "ComicInfo.xml",
      filename: "ComicInfo.xml",
      data: ["ComicInfo.Genre"],
    },
  ],
};

const CONFIG_DIR = APP_DATA
  ? path.join(APP_DATA, APP_NAME)
  : path.join(os.homedir(), ".config", APP_NAME);

const CONFIG_FILENAME = `.${APP_NAME}rc.json`;

const CONFIG_FILEPATH = path.join(CONFIG_DIR, CONFIG_FILENAME);

const DOUJIN_IMAGES_DIRECTORY_PATH = path.resolve(
  path.join(__dirname, "public", "images", "doujin"),
);

const TEMP_IMAGE_DIRECTORY_PATH = path.resolve(
  path.join(__dirname, "public", "images", "temp"),
);

const THUMBNAIL_IMAGE_DIRECTORY_PATH = path.resolve(
  path.join(__dirname, "public", "images", "thumbs"),
);

const COMPRESSED_EXTENSIONS = new Set([
  ".zip",
  ".tar",
  ".gz",
  ".tgz",
  ".bz2",
  ".rar",
  ".7z",
  ".xz",
  ".cbz",
  ".cbr",
]);

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
  ".tiff",
  ".ico",
]);

module.exports = {
  APP_DATA,
  APP_NAME,
  COMPRESSED_EXTENSIONS,
  CONFIG_DEFAULTS,
  CONFIG_DIR,
  CONFIG_FILENAME,
  CONFIG_FILEPATH,
  DOUJIN_IMAGES_DIRECTORY_PATH,
  IMAGE_EXTENSIONS,
  TEMP_IMAGE_DIRECTORY_PATH,
  THUMBNAIL_IMAGE_DIRECTORY_PATH,
};

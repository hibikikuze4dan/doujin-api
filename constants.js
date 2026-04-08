const path = require("path");
const os = require("os");

const APP_NAME = "DoujinApi";

const APP_DATA = process.env.APP_DATA;

const CONFIG_DEFAULTS = {
  content_directory: "",
  thumbnail_directory: "",
};

const CONFIG_DIR = APP_DATA
  ? path.join(APP_DATA, APP_NAME)
  : path.join(os.homedir(), ".config", APP_NAME);

const CONFIG_FILENAME = `.${APP_NAME}rc.json`;

const CONFIG_FILEPATH = path.join(CONFIG_DIR, CONFIG_FILENAME);

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
  IMAGE_EXTENSIONS,
};

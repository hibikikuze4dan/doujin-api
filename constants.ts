import os from "os";
import path from "path";
import { ConfigData } from "./types/configuration";

export const APP_NAME = "DoujinApi";

export const APP_DATA = process.env.APP_DATA;

export const CONFIG_DEFAULTS: ConfigData = {
  content_directory: "",
  lrr_database_backup_path: "",
  thumbnail_directory: "",
  archives_per_page: 20,
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

export const APP_DIR = path.resolve(
  APP_DATA
    ? path.join(APP_DATA, APP_NAME)
    : path.join(os.homedir(), ".config", APP_NAME),
);

export const CONFIG_DIR = APP_DIR;

export const CONFIG_FILENAME = `.${APP_NAME}rc.json`;

export const CONFIG_FILEPATH = path.join(CONFIG_DIR, CONFIG_FILENAME);

export const LOGS_DIR = path.join(APP_DIR, "logs");

export const DATABASE_FILEPATH = path.join(CONFIG_DIR, "archive_api.db");

export const PUBLIC_FILES_DIRECTORY_PATH = path.resolve(
  path.join(__dirname, "public"),
);

export const IMAGE_NOT_FOUND_FILEPATH = path.join(
  PUBLIC_FILES_DIRECTORY_PATH,
  "no-thumb.png",
);

export const ARCHIVE_IMAGES_DIRECTORY_PATH = path.join(
  PUBLIC_FILES_DIRECTORY_PATH,
  "images",
  "archive",
);

export const TEMP_IMAGE_DIRECTORY_PATH = path.join(
  PUBLIC_FILES_DIRECTORY_PATH,
  "images",
  "temp",
);

export const THUMBNAIL_IMAGE_DIRECTORY_PATH = path.join(
  PUBLIC_FILES_DIRECTORY_PATH,
  "images",
  "thumbs",
);

export const ERROR_LOG_FILEPATH = path.join(LOGS_DIR, "error-%DATE%.log");
export const ERROR_LOG_AUDIT_FILEPATH = path.join(
  LOGS_DIR,
  ".error-audit.json",
);

export const COMBINED_LOG_FILEPATH = path.join(LOGS_DIR, "combined-%DATE%.log");
export const COMBINED_LOG_AUDIT_FILEPATH = path.join(
  LOGS_DIR,
  ".combined-audit.json",
);

export const COMPRESSED_EXTENSIONS = new Set([
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

export const IMAGE_EXTENSIONS = new Set([
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

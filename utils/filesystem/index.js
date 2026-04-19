const { createDirectory } = require("./createDirectory");
const { createFile } = require("./createFile");
const { createThumbnail } = require("./createThumbnail");
const { deleteFile } = require("./deleteFile");
const { deleteFolderContents } = require("./deleteFolderContents");
const { extractFirstImage } = require("./extractFirstImage");
const { fileExists } = require("./fileExists");
const { getCompressedFiles } = require("./getCompressedFiles");
const { getCompressedFilepaths } = require("./getCompressedFilepaths");
const {
  getCompressedFileEntryBufferString,
} = require("./getCompressedFileEntryBufferString");
const { getCompressedFileEntries } = require("./getCompressedFileEntries");
const { getCompressedFileImages } = require("./getCompressedFileImages");
const { getFiles } = require("./getFiles");
const { getFileStats } = require("./getFileStats");
const { getImageFiles } = require("./getImageFiles");
const { readFile } = require("./readFile");
const { readJSONFile } = require("./readJSONFile");
const { unzipFileContents } = require("./unzipFileContents");

module.exports = {
  createDirectory,
  createFile,
  createThumbnail,
  deleteFile,
  deleteFolderContents,
  extractFirstImage,
  fileExists,
  getCompressedFiles,
  getCompressedFilepaths,
  getCompressedFileEntryBufferString,
  getCompressedFileEntries,
  getCompressedFileImages,
  getFiles,
  getFileStats,
  getImageFiles,
  readFile,
  readJSONFile,
  unzipFileContents,
};

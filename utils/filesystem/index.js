const { createDirectory } = require("./createDirectory");
const { createFile } = require("./createFile");
const { deleteFile } = require("./deleteFile");
const { deleteFolderContents } = require("./deleteFolderContents");
const { fileExists } = require("./fileExists");
const { getCompressedFiles } = require("./getCompressedFiles");
const { getCompressedFilepaths } = require("./getCompressedFilepaths");
const { getCompressedFileEntries } = require("./getCompressedFileEntries");
const { getCompressedFileImages } = require("./getCompressedFileImages");
const { getFiles } = require("./getFiles");
const { getFileStats } = require("./getFileStats");
const { readFile } = require("./readFile");
const { readJSONFile } = require("./readJSONFile");
const { unzipFileContents } = require("./unzipFileContents");

module.exports = {
  createDirectory,
  createFile,
  deleteFile,
  deleteFolderContents,
  fileExists,
  getCompressedFiles,
  getCompressedFilepaths,
  getCompressedFileEntries,
  getCompressedFileImages,
  getFiles,
  getFileStats,
  readFile,
  readJSONFile,
  unzipFileContents,
};

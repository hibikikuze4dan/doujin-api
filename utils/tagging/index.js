const { getDoujinMetadata } = require("./getDoujinMetadata");
const { getLanraragiDatabaseBackup } = require("./getLanraragiDatabaseBackup");
const { getLanraragiTagsByFilename } = require("./getLanraragiTagsByFilename");
const { getMetadataEntryAndConfig } = require("./getMetadataEntryAndConfig");

module.exports = {
  getDoujinMetadata,
  getLanraragiDatabaseBackup,
  getLanraragiTagsByFilename,
  getMetadataEntryAndConfig,
};

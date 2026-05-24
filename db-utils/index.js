const { getArchiveWithTableData } = require("./getArchiveWithTableData");
const { getCollectionWithArchives } = require("./getCollectionWithArchives");
const { getNumOfNewArchives } = require("./getNumOfNewArchives");
const seeds = require("./seeds");

module.exports = {
  getArchiveWithTableData,
  getCollectionWithArchives,
  getNumOfNewArchives,
  seeds,
};

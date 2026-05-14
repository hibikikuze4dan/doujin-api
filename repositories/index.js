const { initCollectionQueries } = require("./collections-repositories");
const { initArchivesQueries } = require("./doujins-repositories");
const { initHistoryQueries } = require("./history-repositories");
const { initTagsQueries } = require("./tags-repositories");

module.exports = {
  initCollectionQueries,
  initArchivesQueries,
  initHistoryQueries,
  initTagsQueries,
};

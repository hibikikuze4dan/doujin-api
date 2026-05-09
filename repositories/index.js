const { initCollectionQueries } = require("./collections-repositories");
const { initDoujinQueries } = require("./doujins-repositories");
const { initHistoryQueries } = require("./history-repositories");
const { initTagsQueries } = require("./tags-repositories");

module.exports = {
  initCollectionQueries,
  initDoujinQueries,
  initHistoryQueries,
  initTagsQueries,
};

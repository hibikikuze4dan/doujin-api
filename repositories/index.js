const { initCollectionQueries } = require("./collections-repositories");
const { initDoujinQueries } = require("./doujins-repositories");
const { initHistoryQueries } = require("./history-repositories");

module.exports = {
  initCollectionQueries,
  initDoujinQueries,
  initHistoryQueries,
};

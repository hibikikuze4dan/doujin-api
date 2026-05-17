const { initCollectionQueries } = require("./collections-repositories");
const { initArchivesQueries } = require("./archives-repositories");
const { initHistoryQueries } = require("./history-repositories");
const { initTagsQueries } = require("./tags-repositories");
const { initUserQueries } = require("./users-repositories");

module.exports = {
  initCollectionQueries,
  initArchivesQueries,
  initHistoryQueries,
  initTagsQueries,
  initUserQueries,
};

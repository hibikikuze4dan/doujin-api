const Database = require("better-sqlite3");
const path = require("path");
const {
  COLLECTIONS_MIGRATION,
  COLLECTION_ARCHIVES_MIGRATION,
  ARCHIVES_MIGRATION,
  ARCHIVE_HISTORY_MIGRATION,
  TAGS_MIGRATION,
  ARCHIVE_RATING_MIGRATION,
  USERS_MIGRATION,
} = require("./migrate");
const {
  initArchivesQueries,
  initCollectionQueries,
  initHistoryQueries,
  initTagsQueries,
} = require("../repositories");

// TODO: Create database at user supplied location
const db = new Database(path.join(__dirname, "../data.db"));

db.exec(ARCHIVES_MIGRATION);
db.exec(ARCHIVE_HISTORY_MIGRATION);
db.exec(USERS_MIGRATION);
db.exec(ARCHIVE_RATING_MIGRATION);
db.exec(COLLECTIONS_MIGRATION);
db.exec(COLLECTION_ARCHIVES_MIGRATION);
db.exec(TAGS_MIGRATION);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
console.log("Migrations complete");

const collections = initCollectionQueries(db);
const archives = initArchivesQueries(db);
const history = initHistoryQueries(db);
const tags = initTagsQueries(db);

module.exports = {
  database: db,
  archivesQueries: archives,
  collectionsQueries: collections,
  historyQueries: history,
  tagsQueries: tags,
};

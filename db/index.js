const Database = require("better-sqlite3");
const path = require("path");
const {
  COLLECTIONS_MIGRATION,
  COLLECTION_DOUJINS_MIGRATION,
  DOUJINS_MIGRATION,
} = require("./migrate");
const { initDoujinQueries, initCollectionQueries } = require("../repositories");

// TODO: Create database at user supplied location
const db = new Database(path.join(__dirname, "../data.db"));

db.exec(DOUJINS_MIGRATION);
db.exec(COLLECTIONS_MIGRATION);
db.exec(COLLECTION_DOUJINS_MIGRATION);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
console.log("Migrations complete");

const collections = initCollectionQueries(db);
const doujins = initDoujinQueries(db);

module.exports = {
  database: db,
  doujinsQueries: doujins,
  collectionsQueries: collections,
};

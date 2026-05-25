import Database from "better-sqlite3";
import path from "path";
import {
  ARCHIVE_HISTORY_MIGRATION,
  ARCHIVE_RATING_MIGRATION,
  ARCHIVES_MIGRATION,
  COLLECTION_ARCHIVES_MIGRATION,
  COLLECTIONS_MIGRATION,
  TAGS_MIGRATION,
  USERS_MIGRATION,
} from "./migrate";
import {
  initArchivesQueries,
  initCollectionQueries,
  initHistoryQueries,
  initRatingRepositories,
  initTagsQueries,
  initUserQueries,
} from "../repositories";

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
const ratings = initRatingRepositories(db);
const tags = initTagsQueries(db);
const users = initUserQueries(db);

module.exports = {
  database: db,
  archivesQueries: archives,
  collectionsQueries: collections,
  historyQueries: history,
  ratingQueries: ratings,
  tagsQueries: tags,
  userQueries: users,
};

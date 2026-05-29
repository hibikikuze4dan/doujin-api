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

export const database = db;
export const collectionsQueries = initCollectionQueries(db);
export const archivesQueries = initArchivesQueries(db);
export const historyQueries = initHistoryQueries(db);
export const ratingQueries = initRatingRepositories(db);
export const tagsQueries = initTagsQueries(db);
export const userQueries = initUserQueries(db);

import Database from "better-sqlite3";

import {
  ARCHIVE_FTS_MIGRATION,
  ARCHIVE_FTS_TRIGGERS_MIGRATION,
  ARCHIVE_SEARCH_TOKENS_MIGRATION,
  ARCHIVE_SEARCH_TOKENS_TRIGGERS_MIGRATION,
  ARCHIVES_TAGS_FTS_MIGRATION,
  ARCHIVES_TAGS_FTS_TRIGGERS_MIGRATION,
  ARCHIVE_HISTORY_MIGRATION,
  ARCHIVE_INDEX_MIGRATION,
  ARCHIVE_RATING_MIGRATION,
  ARCHIVES_MIGRATION,
  AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION,
  COLLECTION_ARCHIVES_INDEX_MIGRATION,
  COLLECTION_ARCHIVES_MIGRATION,
  COLLECTIONS_MIGRATION,
  populateArchiveSearchTokens,
  TAGS_FTS_MIGRATION,
  TAGS_FTS_TRIGGERS_MIGRATION,
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
import { DATABASE_FILEPATH } from "../constants";

const db = new Database(DATABASE_FILEPATH, { verbose: console.log });

db.exec(ARCHIVES_MIGRATION);
db.exec(ARCHIVE_INDEX_MIGRATION);
db.exec(ARCHIVE_HISTORY_MIGRATION);
db.exec(USERS_MIGRATION);
db.exec(ARCHIVE_RATING_MIGRATION);
db.exec(AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION);
db.exec(COLLECTIONS_MIGRATION);
db.exec(COLLECTION_ARCHIVES_MIGRATION);
db.exec(COLLECTION_ARCHIVES_INDEX_MIGRATION);
db.exec(TAGS_MIGRATION);
db.exec(ARCHIVE_FTS_MIGRATION);
db.exec(ARCHIVE_FTS_TRIGGERS_MIGRATION);
db.exec(ARCHIVE_SEARCH_TOKENS_MIGRATION);
db.exec(ARCHIVE_SEARCH_TOKENS_TRIGGERS_MIGRATION);
db.exec(ARCHIVES_TAGS_FTS_MIGRATION);
db.exec(ARCHIVES_TAGS_FTS_TRIGGERS_MIGRATION);
db.exec(TAGS_FTS_MIGRATION);
db.exec(TAGS_FTS_TRIGGERS_MIGRATION);
populateArchiveSearchTokens(db);
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

import Database, { type SqliteError } from "better-sqlite3";

import {
  ARCHIVE_FTS5_MIGRATION,
  ARCHIVE_FTS5_TRIGGER_AFTER_DELETE,
  ARCHIVE_FTS5_TRIGGER_AFTER_INSERT,
  ARCHIVE_FTS5_TRIGGER_AFTER_UPDATE,
  ARCHIVE_HISTORY_MIGRATION,
  ARCHIVE_INDEXES,
  ARCHIVE_MIGRATION,
  ARCHIVE_RATING_MIGRATION,
  ARCHIVE_TAG,
  ARCHIVE_TAG_INDEXES,
  ARCHIVE_TAG_TRIGGER_AFTER_DELETE,
  ARCHIVE_TAG_TRIGGER_AFTER_INSERT,
  ARCHIVE_TAG_TRIGGER_AFTER_UPDATE,
  AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION,
  COLLECTION_ARCHIVES_INDEX_MIGRATION,
  COLLECTION_ARCHIVES_MIGRATION,
  COLLECTIONS_MIGRATION,
  TAG_CATEGORY,
  TAG_INDEXES,
  TAG_MIGRATION,
  USERS_MIGRATION,
} from "./migrate";
import {
  initArchivesQueries,
  initArchiveTagQueries,
  initCollectionQueries,
  initHistoryQueries,
  initRatingRepositories,
  initTagCategoryQueries,
  initTagsQueries,
  initUserQueries,
} from "../repositories";
import { DATABASE_FILEPATH } from "../constants";

const db = new Database(DATABASE_FILEPATH);

try {
  db.exec(ARCHIVE_MIGRATION);
  db.exec(ARCHIVE_INDEXES);
  db.exec(ARCHIVE_FTS5_MIGRATION);
  db.exec(ARCHIVE_FTS5_TRIGGER_AFTER_DELETE);
  db.exec(ARCHIVE_FTS5_TRIGGER_AFTER_INSERT);
  db.exec(ARCHIVE_FTS5_TRIGGER_AFTER_UPDATE);
  db.exec(TAG_CATEGORY);
  db.exec(TAG_MIGRATION);
  db.exec(TAG_INDEXES);
  db.exec(ARCHIVE_TAG);
  db.exec(ARCHIVE_TAG_INDEXES);
  db.exec(ARCHIVE_TAG_TRIGGER_AFTER_DELETE);
  db.exec(ARCHIVE_TAG_TRIGGER_AFTER_INSERT);
  db.exec(ARCHIVE_TAG_TRIGGER_AFTER_UPDATE);
  db.exec(ARCHIVE_HISTORY_MIGRATION);
  db.exec(USERS_MIGRATION);
  db.exec(ARCHIVE_RATING_MIGRATION);
  db.exec(AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION);
  db.exec(COLLECTIONS_MIGRATION);
  db.exec(COLLECTION_ARCHIVES_MIGRATION);
  db.exec(COLLECTION_ARCHIVES_INDEX_MIGRATION);
} catch (error) {
  const err = error as { code: SqliteError; message: SqliteError };
  console.error(err?.code);
  console.error(err?.message);
}
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
console.log("Migrations complete");

export const database = db;
export const collectionsQueries = initCollectionQueries(db);
export const archivesQueries = initArchivesQueries(db);
export const archiveTagQueries = initArchiveTagQueries(db);
export const historyQueries = initHistoryQueries(db);
export const ratingQueries = initRatingRepositories(db);
export const tagsQueries = initTagsQueries(db);
export const tagCategoryQueries = initTagCategoryQueries(db);
export const userQueries = initUserQueries(db);

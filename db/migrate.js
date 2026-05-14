const ARCHIVES_MIGRATION = `
  CREATE TABLE IF NOT EXISTS archives (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL,
    filepath     TEXT    NOT NULL UNIQUE,
    date_added  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    date_created TEXT   NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    pagecount   INTEGER NOT NULL,
    size        INTEGER NOT NULL
  )
`;

const TAGS_MIGRATION = `
  CREATE TABLE IF NOT EXISTS tags (
    id          INTEGER PRIMARY KEY,
    archive_id   INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    namespace   TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE,
    UNIQUE (archive_id, name, namespace)
  )
`;

const ARCHIVE_HISTORY_MIGRATION = `
  CREATE TABLE IF NOT EXISTS archive_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    archive_id   INTEGER NOT NULL,
    last_page   INTEGER NOT NULL DEFAULT 1,
    accessed_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE
  )
`;

const COLLECTIONS_MIGRATION = `
  CREATE TABLE IF NOT EXISTS collections (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL UNIQUE,
    description TEXT    NOT NULL DEFAULT '',
    date_added  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
`;

const COLLECTION_ARCHIVES_MIGRATION = `
  CREATE TABLE IF NOT EXISTS collection_archives (
    collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    archive_id     INTEGER NOT NULL REFERENCES archives(id)     ON DELETE CASCADE,
    date_added    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    PRIMARY KEY (collection_id, archive_id)
  );
`;

module.exports = {
  COLLECTION_ARCHIVES_MIGRATION,
  COLLECTIONS_MIGRATION,
  ARCHIVES_MIGRATION,
  ARCHIVE_HISTORY_MIGRATION,
  TAGS_MIGRATION,
};

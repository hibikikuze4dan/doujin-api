const DOUJINS_MIGRATION = `
  CREATE TABLE IF NOT EXISTS doujins (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL,
    filepath     TEXT    NOT NULL UNIQUE,
    tags        TEXT    NOT NULL DEFAULT '',
    date_added  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    date_created TEXT   NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    pagecount   INTEGER NOT NULL,
    size        INTEGER NOT NULL
  )
`;

const DOUJIN_HISTORY_MIGRATION = `
  CREATE TABLE IF NOT EXISTS doujin_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    doujin_id   INTEGER NOT NULL,
    last_page   INTEGER NOT NULL DEFAULT 1,
    accessed_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (doujin_id) REFERENCES doujins(id) ON DELETE CASCADE
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

const COLLECTION_DOUJINS_MIGRATION = `
  CREATE TABLE IF NOT EXISTS collection_doujins (
    collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    doujin_id     INTEGER NOT NULL REFERENCES doujins(id)     ON DELETE CASCADE,
    date_added    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    PRIMARY KEY (collection_id, doujin_id)
  );
`;

module.exports = {
  DOUJINS_MIGRATION,
  DOUJIN_HISTORY_MIGRATION,
  COLLECTIONS_MIGRATION,
  COLLECTION_DOUJINS_MIGRATION,
};

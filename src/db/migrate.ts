export const ARCHIVES_MIGRATION = `
  CREATE TABLE IF NOT EXISTS archives (
    id          INTEGER PRIMARY KEY,
    rating  INTEGER NOT NULL DEFAULT 0,
    name        TEXT    NOT NULL,
    filepath     TEXT    NOT NULL UNIQUE,
    date_added  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    date_created TEXT   NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    pagecount   INTEGER NOT NULL,
    size        INTEGER NOT NULL
  )
`;

export const ARCHIVE_INDEX_MIGRATION = `
  CREATE INDEX IF NOT EXISTS idx_archives_name ON archives(name, id);
  CREATE INDEX IF NOT EXISTS idx_archives_size ON archives(size, id);
  CREATE INDEX IF NOT EXISTS idx_archives_pagecount ON archives(pagecount, id);
  CREATE INDEX IF NOT EXISTS idx_archives_date_added ON archives(date_added, id);
  CREATE INDEX IF NOT EXISTS idx_archives_date_created ON archives(date_created, id);
  CREATE INDEX IF NOT EXISTS idx_archives_rating ON archives(rating, id);
`;

export const TAGS_MIGRATION = `
  CREATE TABLE IF NOT EXISTS tags (
    id          INTEGER PRIMARY KEY,
    archive_id   INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    namespace   TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE,
    UNIQUE (archive_id, name, namespace)
  )
`;

export const ARCHIVE_HISTORY_MIGRATION = `
  CREATE TABLE IF NOT EXISTS archive_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    archive_id   INTEGER NOT NULL,
    last_page   INTEGER NOT NULL DEFAULT 1,
    accessed_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE
  )
`;

export const USERS_MIGRATION = `
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    username     TEXT NOT NULL UNIQUE,
    created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    password     TEXT NOT NULL,
    salt         TEXT NOT NULL
  )
`;

export const ARCHIVE_RATING_MIGRATION = `
  CREATE TABLE IF NOT EXISTS archive_rating (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    archive_id   INTEGER NOT NULL,
    user_id      INTEGER NOT NULL,
    rating       INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 10),
    rated_at     TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE
  )
`;

export const AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION = `
  CREATE TRIGGER IF NOT EXISTS trg_rating_after_insert
  AFTER INSERT ON archive_rating
  BEGIN
    UPDATE archives
    SET rating = (SELECT COALESCE(AVG(rating), 0) FROM archive_rating WHERE archive_id = NEW.archive_id)
    WHERE id = NEW.archive_id;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_rating_after_update
  AFTER UPDATE ON archive_rating
  BEGIN
    UPDATE archives
    SET rating = (SELECT COALESCE(AVG(rating), 0) FROM archive_rating WHERE archive_id = NEW.archive_id)
    WHERE id = NEW.archive_id;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_rating_after_delete
  AFTER DELETE ON archive_rating
  BEGIN
    UPDATE archives
    SET rating = (SELECT COALESCE(AVG(rating), 0) FROM archive_rating WHERE archive_id = OLD.archive_id)
    WHERE id = OLD.archive_id;
  END;
`;

export const COLLECTIONS_MIGRATION = `
  CREATE TABLE IF NOT EXISTS collections (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL UNIQUE,
    description TEXT    NOT NULL DEFAULT '',
    date_added  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
`;

export const COLLECTION_ARCHIVES_MIGRATION = `
  CREATE TABLE IF NOT EXISTS collection_archives (
    collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    archive_id     INTEGER NOT NULL REFERENCES archives(id)     ON DELETE CASCADE,
    date_added    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    PRIMARY KEY (collection_id, archive_id)
  );
`;

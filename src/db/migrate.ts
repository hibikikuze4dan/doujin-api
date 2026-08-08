export const ARCHIVE_MIGRATION = `
  CREATE TABLE IF NOT EXISTS archive (
    id          INTEGER PRIMARY KEY,
    rating  INTEGER NOT NULL DEFAULT 0,
    name        TEXT    NOT NULL,
    filepath     TEXT   NOT NULL UNIQUE,
    tags        TEXT    NOT NULL DEFAULT '',
    date_added  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    date_created TEXT   NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    pagecount   INTEGER NOT NULL,
    size        INTEGER NOT NULL
  )
`;

export const ARCHIVE_INDEXES = `
  CREATE INDEX IF NOT EXISTS archive_index_rating ON archive(rating);
  CREATE INDEX IF NOT EXISTS archive_index_pagecount ON archive(pagecount);
  CREATE INDEX IF NOT EXISTS archive_index_size ON archive(size);
  CREATE INDEX IF NOT EXISTS archive_index_date_added ON archive(date_added);
  CREATE INDEX IF NOT EXISTS archive_index_date_created ON archive(date_created);
`;

export const ARCHIVE_FTS5_MIGRATION = `
  CREATE VIRTUAL TABLE IF NOT EXISTS archive_fts USING fts5(
    name,
    tags,
    content='archive',
    content_rowid='id'
  );
`;

export const ARCHIVE_FTS5_TRIGGER_AFTER_INSERT = `
  CREATE TRIGGER IF NOT EXISTS archive_fts_after_insert AFTER INSERT ON archive BEGIN
    INSERT INTO archive_fts(rowid, name, tags) VALUES (new.id, new.name, new.tags);
  END;
`;

export const ARCHIVE_FTS5_TRIGGER_AFTER_UPDATE = `
  CREATE TRIGGER IF NOT EXISTS archive_fts_after_update AFTER UPDATE ON archive BEGIN
    INSERT INTO archive_fts(archive_fts, rowid, name, tags) VALUES('delete', old.id, old.name, old.tags);
    INSERT INTO archive_fts(rowid, name, tags) VALUES (new.id, new.name, new.tags);
  END;
`;

export const ARCHIVE_FTS5_TRIGGER_AFTER_DELETE = `
  CREATE TRIGGER IF NOT EXISTS archive_fts_after_delete AFTER DELETE ON archive BEGIN
    INSERT INTO archive_fts(archive_fts, rowid, name, tags) VALUES('delete', old.id, old.name, old.tags);
  END;
`;

export const TAG_CATEGORY = `
  CREATE TABLE IF NOT EXISTS tag_category (
    id          INTEGER     PRIMARY KEY,
    name        TEXT        NOT NULL        UNIQUE
  )
`;

export const TAG_MIGRATION = `
  CREATE TABLE IF NOT EXISTS tag (
    id           INTEGER     PRIMARY KEY,
    name         TEXT        NOT NULL,
    category_id  INTEGER     DEFAULT NULL, 
    FOREIGN KEY (category_id) REFERENCES tag_category(id) ON DELETE CASCADE,
    UNIQUE (category_id, name)
  )
`;

export const TAG_INDEXES = `
  CREATE INDEX IF NOT EXISTS tag_index_category_id ON tag(category_id);
  CREATE INDEX IF NOT EXISTS tag_index_name ON tag(name);
`;

export const ARCHIVE_TAG = `
  CREATE TABLE IF NOT EXISTS archive_tag (
    id          INTEGER     PRIMARY KEY,
    archive_id  INTEGER     NOT NULL,
    tag_id      INTEGER     NOT NULL,
    FOREIGN KEY (archive_id) REFERENCES archive(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE,
    UNIQUE (archive_id, tag_id)
  )
`;

export const ARCHIVE_TAG_INDEXES = `
  CREATE INDEX IF NOT EXISTS archive_tag_index_archive_id ON archive_tag(archive_id);
  CREATE INDEX IF NOT EXISTS archive_tag_index_tag_id ON archive_tag(tag_id);
`;

export const ARCHIVE_TAG_TRIGGER_AFTER_INSERT = `
  CREATE TRIGGER IF NOT EXISTS archive_tag_after_insert
  AFTER INSERT ON archive_tag
  BEGIN
    UPDATE archive SET tags = (
      SELECT COALESCE(GROUP_CONCAT(
        CASE WHEN tc.name = '' THEN t.name ELSE tc.name || ': ' || t.name END
      ), '')
      FROM archive_tag at
      JOIN tag t ON t.id = at.tag_id
      JOIN tag_category tc ON tc.id = t.category_id
      WHERE at.archive_id = NEW.archive_id
    )
    WHERE id = NEW.archive_id;
  END;
`;

export const ARCHIVE_TAG_TRIGGER_AFTER_DELETE = `
  CREATE TRIGGER IF NOT EXISTS archive_tag_ad
  AFTER DELETE ON archive_tag
  BEGIN
    UPDATE archive SET tags = (
      SELECT COALESCE(GROUP_CONCAT(
        CASE WHEN tc.name = '' THEN t.name ELSE tc.name || ': ' || t.name END
      ), '')
      FROM archive_tag at
      JOIN tag t ON t.id = at.tag_id
      JOIN tag_category tc ON tc.id = t.category_id
      WHERE at.archive_id = OLD.archive_id
    )
    WHERE id = OLD.archive_id;
  END;
`;

export const ARCHIVE_TAG_TRIGGER_AFTER_UPDATE = `
  CREATE TRIGGER IF NOT EXISTS archive_tag_au
  AFTER UPDATE ON archive_tag
  BEGIN
    UPDATE archive SET tags = (
      SELECT COALESCE(GROUP_CONCAT(
        CASE WHEN tc.name = '' THEN t.name ELSE tc.name || ': ' || t.name END
      ), '')
      FROM archive_tag at
      JOIN tag t ON t.id = at.tag_id
      JOIN tag_category tc ON tc.id = t.category_id
      WHERE at.archive_id = NEW.archive_id
    )
    WHERE id = NEW.archive_id;

    UPDATE archive SET tags = (
      SELECT COALESCE(GROUP_CONCAT(
        CASE WHEN tc.name = '' THEN t.name ELSE tc.name || ': ' || t.name END
      ), '')
      FROM archive_tag at
      JOIN tag t ON t.id = at.tag_id
      JOIN tag_category tc ON tc.id = t.category_id
      WHERE at.archive_id = OLD.archive_id
    )
    WHERE id = OLD.archive_id AND OLD.archive_id != NEW.archive_id;
  END;
`;

export const ARCHIVE_HISTORY_MIGRATION = `
  CREATE TABLE IF NOT EXISTS archive_history (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    archive_id   INTEGER NOT NULL,
    last_page   INTEGER NOT NULL DEFAULT 1,
    accessed_at TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (archive_id) REFERENCES archive(id) ON DELETE CASCADE
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
    FOREIGN KEY (archive_id) REFERENCES archive(id) ON DELETE CASCADE
  )
`;

export const AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION = `
  CREATE TRIGGER IF NOT EXISTS trg_rating_after_insert
  AFTER INSERT ON archive_rating
  BEGIN
    UPDATE archive
    SET rating = (SELECT COALESCE(AVG(rating), 0) FROM archive_rating WHERE archive_id = NEW.archive_id)
    WHERE id = NEW.archive_id;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_rating_after_update
  AFTER UPDATE ON archive_rating
  BEGIN
    UPDATE archive
    SET rating = (SELECT COALESCE(AVG(rating), 0) FROM archive_rating WHERE archive_id = NEW.archive_id)
    WHERE id = NEW.archive_id;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_rating_after_delete
  AFTER DELETE ON archive_rating
  BEGIN
    UPDATE archive
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
    archive_id     INTEGER NOT NULL REFERENCES archive(id)     ON DELETE CASCADE,
    date_added    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    position    REAL    NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, archive_id)
  );
`;

export const COLLECTION_ARCHIVES_INDEX_MIGRATION = `
  CREATE INDEX IF NOT EXISTS idx_collection_archives_position
    ON collection_archives(collection_id, position);
  CREATE INDEX IF NOT EXISTS idx_collection_archives_archive_id
    ON collection_archives(archive_id, collection_id);
  CREATE INDEX IF NOT EXISTS idx_collection_archives_collection_id
    ON collection_archives(collection_id, archive_id);
`;

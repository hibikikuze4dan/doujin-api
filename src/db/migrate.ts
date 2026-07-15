import { type Database } from "better-sqlite3";

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

export const ARCHIVE_FTS_MIGRATION = `
  DROP TRIGGER IF EXISTS archives_fts_ai;
  DROP TRIGGER IF EXISTS archives_fts_ad;
  DROP TRIGGER IF EXISTS archives_fts_au;
  DROP TABLE IF EXISTS archives_fts;

  CREATE VIRTUAL TABLE archives_fts USING fts5(
    name,
    content='archives',
    content_rowid='id',
    tokenize='trigram',
    prefix='2 3 4 5 6'
  );

  INSERT INTO archives_fts(rowid, name)
  SELECT id, name
  FROM archives;
`;

export const ARCHIVE_FTS_TRIGGERS_MIGRATION = `
  CREATE TRIGGER IF NOT EXISTS archives_fts_ai AFTER INSERT ON archives BEGIN
    INSERT INTO archives_fts(rowid, name) VALUES (new.id, new.name);
  END;

  CREATE TRIGGER IF NOT EXISTS archives_fts_ad AFTER DELETE ON archives BEGIN
    INSERT INTO archives_fts(archives_fts, rowid, name) VALUES ('delete', old.id, old.name);
  END;

  CREATE TRIGGER IF NOT EXISTS archives_fts_au AFTER UPDATE ON archives BEGIN
    INSERT INTO archives_fts(archives_fts, rowid, name) VALUES ('delete', old.id, old.name);
    INSERT INTO archives_fts(rowid, name) VALUES (new.id, new.name);
  END;
`;

export const TAGS_MIGRATION = `
  CREATE TABLE IF NOT EXISTS tags (
    id          INTEGER PRIMARY KEY,
    archive_id   INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    namespace   TEXT    NOT NULL DEFAULT '',
    FOREIGN KEY (archive_id) REFERENCES archives(id) ON DELETE CASCADE,
    UNIQUE (archive_id, name, namespace)
  );
  CREATE INDEX IF NOT EXISTS idx_tags_archive_id ON tags(archive_id);
  CREATE INDEX IF NOT EXISTS idx_tags_archive_id_name ON tags(archive_id, name COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_tags_namespace_name ON tags(namespace COLLATE NOCASE, name COLLATE NOCASE);
  CREATE INDEX IF NOT EXISTS idx_tags_archive_id_name_namespace ON tags(archive_id, namespace COLLATE NOCASE, name COLLATE NOCASE);
`;

export const TAGS_FTS_MIGRATION = `
  DROP TRIGGER IF EXISTS tags_fts_ai;
  DROP TRIGGER IF EXISTS tags_fts_ad;
  DROP TRIGGER IF EXISTS tags_fts_au;
  DROP TABLE IF EXISTS tags_fts;

  CREATE VIRTUAL TABLE tags_fts USING fts5(
    tag_text,
    content='',
    tokenize='trigram',
    prefix='2 3 4 5 6'
  );

  INSERT INTO tags_fts(rowid, tag_text)
  SELECT id, CASE WHEN namespace = '' THEN name ELSE namespace || ':' || name END
  FROM tags;
`;

export const TAGS_FTS_TRIGGERS_MIGRATION = `
  CREATE TRIGGER IF NOT EXISTS tags_fts_ai AFTER INSERT ON tags BEGIN
    INSERT INTO tags_fts(rowid, tag_text)
    VALUES (new.id, CASE WHEN new.namespace = '' THEN new.name ELSE new.namespace || ':' || new.name END);
  END;

  CREATE TRIGGER IF NOT EXISTS tags_fts_ad AFTER DELETE ON tags BEGIN
    INSERT INTO tags_fts(tags_fts, rowid, tag_text)
    VALUES ('delete', old.id, CASE WHEN old.namespace = '' THEN old.name ELSE old.namespace || ':' || old.name END);
  END;

  CREATE TRIGGER IF NOT EXISTS tags_fts_au AFTER UPDATE ON tags BEGIN
    INSERT INTO tags_fts(tags_fts, rowid, tag_text)
    VALUES ('delete', old.id, CASE WHEN old.namespace = '' THEN old.name ELSE old.namespace || ':' || old.name END);
    INSERT INTO tags_fts(rowid, tag_text)
    VALUES (new.id, CASE WHEN new.namespace = '' THEN new.name ELSE new.namespace || ':' || new.name END);
  END;
`;

export const ARCHIVES_TAGS_FTS_MIGRATION = `
  DROP TRIGGER IF EXISTS archives_tags_fts_ai;
  DROP TRIGGER IF EXISTS archives_tags_fts_ad;
  DROP TRIGGER IF EXISTS archives_tags_fts_au;
  DROP TRIGGER IF EXISTS archives_tags_fts_tags_ai;
  DROP TRIGGER IF EXISTS archives_tags_fts_tags_ad;
  DROP TRIGGER IF EXISTS archives_tags_fts_tags_au;
  DROP TABLE IF EXISTS archives_tags_fts;

  CREATE VIRTUAL TABLE archives_tags_fts USING fts5(
    name,
    tags,
    content='',
    tokenize='unicode61',
    prefix='2 3 4 5 6'
  );

  INSERT INTO archives_tags_fts(rowid, name, tags)
  SELECT
    a.id,
    a.name,
    COALESCE(
      GROUP_CONCAT(CASE WHEN t.namespace = '' THEN t.name ELSE t.namespace || ':' || t.name END, ' '),
      ''
    )
  FROM archives a
  LEFT JOIN tags t ON t.archive_id = a.id
  GROUP BY a.id;
`;

export const ARCHIVES_TAGS_FTS_TRIGGERS_MIGRATION = `
  CREATE TRIGGER IF NOT EXISTS archives_tags_fts_ai AFTER INSERT ON archives BEGIN
    INSERT INTO archives_tags_fts(rowid, name, tags)
    VALUES (
      new.id,
      new.name,
      COALESCE(
        (SELECT GROUP_CONCAT(CASE WHEN namespace = '' THEN name ELSE namespace || ':' || name END, ' ') FROM tags WHERE archive_id = new.id),
        ''
      )
    );
  END;

  CREATE TRIGGER IF NOT EXISTS archives_tags_fts_ad AFTER DELETE ON archives BEGIN
    INSERT INTO archives_tags_fts(archives_tags_fts, rowid, name, tags)
    VALUES ('delete', old.id, old.name, '');
  END;

  CREATE TRIGGER IF NOT EXISTS archives_tags_fts_au AFTER UPDATE ON archives BEGIN
    INSERT INTO archives_tags_fts(archives_tags_fts, rowid, name, tags)
    VALUES ('delete', old.id, old.name, '');
    INSERT INTO archives_tags_fts(rowid, name, tags)
    VALUES (
      new.id,
      new.name,
      COALESCE(
        (SELECT GROUP_CONCAT(CASE WHEN namespace = '' THEN name ELSE namespace || ':' || name END, ' ') FROM tags WHERE archive_id = new.id),
        ''
      )
    );
  END;

  CREATE TRIGGER IF NOT EXISTS archives_tags_fts_tags_ai AFTER INSERT ON tags BEGIN
    INSERT INTO archives_tags_fts(archives_tags_fts, rowid, name, tags)
    VALUES ('delete', NEW.archive_id, '', '');
    INSERT INTO archives_tags_fts(rowid, name, tags)
    VALUES (
      NEW.archive_id,
      COALESCE((SELECT name FROM archives WHERE id = NEW.archive_id), ''),
      COALESCE(
        (SELECT GROUP_CONCAT(CASE WHEN namespace = '' THEN name ELSE namespace || ':' || name END, ' ') FROM tags WHERE archive_id = NEW.archive_id),
        ''
      )
    );
  END;

  CREATE TRIGGER IF NOT EXISTS archives_tags_fts_tags_ad AFTER DELETE ON tags BEGIN
    INSERT INTO archives_tags_fts(archives_tags_fts, rowid, name, tags)
    VALUES ('delete', OLD.archive_id, '', '');
    INSERT INTO archives_tags_fts(rowid, name, tags)
    VALUES (
      OLD.archive_id,
      COALESCE((SELECT name FROM archives WHERE id = OLD.archive_id), ''),
      COALESCE(
        (SELECT GROUP_CONCAT(CASE WHEN namespace = '' THEN name ELSE namespace || ':' || name END, ' ') FROM tags WHERE archive_id = OLD.archive_id),
        ''
      )
    );
  END;

  CREATE TRIGGER IF NOT EXISTS archives_tags_fts_tags_au AFTER UPDATE ON tags BEGIN
    INSERT INTO archives_tags_fts(archives_tags_fts, rowid, name, tags)
    VALUES ('delete', OLD.archive_id, '', '');
    INSERT INTO archives_tags_fts(rowid, name, tags)
    VALUES (
      NEW.archive_id,
      COALESCE((SELECT name FROM archives WHERE id = NEW.archive_id), ''),
      COALESCE(
        (SELECT GROUP_CONCAT(CASE WHEN namespace = '' THEN name ELSE namespace || ':' || name END, ' ') FROM tags WHERE archive_id = NEW.archive_id),
        ''
      )
    );
  END;
`;

export const ARCHIVE_SEARCH_TOKENS_MIGRATION = `
  CREATE TABLE IF NOT EXISTS archive_search_tokens (
    archive_id INTEGER NOT NULL,
    token TEXT NOT NULL,
    PRIMARY KEY (archive_id, token)
  );

  CREATE INDEX IF NOT EXISTS idx_archive_search_tokens_token
    ON archive_search_tokens(token, archive_id);
`;

export const ARCHIVE_SEARCH_TOKENS_TRIGGERS_MIGRATION = `
  CREATE TRIGGER IF NOT EXISTS archive_search_tokens_ai AFTER INSERT ON archives BEGIN
    DELETE FROM archive_search_tokens WHERE archive_id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS archive_search_tokens_au AFTER UPDATE ON archives BEGIN
    DELETE FROM archive_search_tokens WHERE archive_id = NEW.id;
  END;

  CREATE TRIGGER IF NOT EXISTS archive_search_tokens_ad AFTER DELETE ON archives BEGIN
    DELETE FROM archive_search_tokens WHERE archive_id = OLD.id;
  END;

  CREATE TRIGGER IF NOT EXISTS archive_search_tokens_tags_ai AFTER INSERT ON tags BEGIN
    DELETE FROM archive_search_tokens WHERE archive_id = NEW.archive_id;
  END;

  CREATE TRIGGER IF NOT EXISTS archive_search_tokens_tags_au AFTER UPDATE ON tags BEGIN
    DELETE FROM archive_search_tokens WHERE archive_id = NEW.archive_id;
  END;

  CREATE TRIGGER IF NOT EXISTS archive_search_tokens_tags_ad AFTER DELETE ON tags BEGIN
    DELETE FROM archive_search_tokens WHERE archive_id = OLD.archive_id;
  END;
`;

export const populateArchiveSearchTokens = (db: Database) => {
  db.exec(ARCHIVE_SEARCH_TOKENS_MIGRATION);
  db.exec(ARCHIVE_SEARCH_TOKENS_TRIGGERS_MIGRATION);

  const deleteStmt = db.prepare(`DELETE FROM archive_search_tokens`);
  const insertStmt = db.prepare(
    `INSERT INTO archive_search_tokens (archive_id, token) VALUES (?, ?)`,
  );

  const tokenize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .filter((token) => token.length > 1);

  const archives = db.prepare(`SELECT id, name FROM archives`).all() as Array<{
    id: number;
    name: string;
  }>;
  const tags = db
    .prepare(`SELECT archive_id, name, namespace FROM tags`)
    .all() as Array<{ archive_id: number; name: string; namespace: string }>;

  deleteStmt.run();

  const rows: Array<{ archive_id: number; token: string }> = [];

  for (const archive of archives) {
    for (const token of tokenize(archive.name)) {
      rows.push({ archive_id: archive.id, token });
    }
  }

  for (const tag of tags) {
    for (const token of tokenize(tag.name)) {
      rows.push({ archive_id: tag.archive_id, token });
    }
    if (tag.namespace) {
      for (const token of tokenize(tag.namespace)) {
        rows.push({ archive_id: tag.archive_id, token });
      }
    }
  }

  const uniqueRows = rows.filter(
    (row, index, array) =>
      array.findIndex(
        (candidate) =>
          candidate.archive_id === row.archive_id &&
          candidate.token === row.token,
      ) === index,
  );

  const insertMany = db.transaction(
    (items: Array<{ archive_id: number; token: string }>) => {
      for (const item of items) {
        insertStmt.run(item.archive_id, item.token);
      }
    },
  );

  insertMany(uniqueRows);
};

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

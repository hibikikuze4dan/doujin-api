import { type Database } from "better-sqlite3";
import { type Tag } from "../types/database";

const addTag = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO tags (archive_id, name, namespace)
    VALUES (@archive_id, @name, @namespace)
  `);
  return ({
    archive_id,
    name,
    namespace = "",
  }: {
    archive_id: number;
    name: string;
    namespace: string;
  }) => stmt.run({ archive_id, name, namespace });
};

const addTags = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO tags (archive_id, name, namespace)
    VALUES (@archive_id, @name, @namespace)
  `);
  const insertMany = db.transaction((tags) => {
    for (const tag of tags) {
      stmt.run({ namespace: "", ...tag });
    }
  });
  return (tags: { archive_id: number; name: string; namespace: string }[]) =>
    insertMany(tags);
};

const getTagsByArchiveId = (db: Database) => {
  const stmt = db.prepare(`SELECT * FROM tags WHERE archive_id = ?`);
  return (archive_id: number) => stmt.all(archive_id) as Tag[];
};

const getTagsByArchiveIdNameAndNamespace = (db: Database) => {
  const stmt = db.prepare(
    `SELECT * FROM tags WHERE archive_id = ? AND name = ? AND namespace = ?`,
  );
  return ({
    archive_id,
    name,
    namespace,
  }: {
    archive_id: number;
    name: string;
    namespace: string;
  }) => stmt.get(archive_id, name, namespace);
};

const getTagsByName = (db: Database) => {
  const stmt = db.prepare(`SELECT * FROM tags WHERE name = ?`);
  return (name: string) => stmt.all(name) as Tag[];
};

const getTagsByNamespace = (db: Database) => {
  const stmt = db.prepare(`SELECT * FROM tags WHERE namespace = ?`);
  return (namespace: string) => stmt.all(namespace) as Tag[];
};

const getTagByNameAndNamespace = (db: Database) => {
  const stmt = db.prepare(
    `SELECT * FROM tags WHERE name = ? AND namespace = ?`,
  );
  return (name = "", namespace = "") =>
    stmt.get(name, namespace) as Tag | undefined;
};

const searchTags = (db: Database) => {
  const stmt = db.prepare(`
    SELECT namespace, name, MIN(id) as id, MIN(archive_id) as archive_id
    FROM tags
    WHERE name LIKE ?
      OR namespace LIKE ?
      OR (namespace || ':' || name) LIKE ?
    GROUP BY namespace, name
    ORDER BY namespace ASC, name ASC
  `);
  return (tagQuery: string) => {
    const pattern = `%${tagQuery}%`;
    return stmt.all(pattern, pattern, pattern) as Tag[];
  };
};

const updateTag = (db: Database) => {
  const stmt = db.prepare(`
    UPDATE tags
    SET name = @name, namespace = @namespace
    WHERE id = @id
  `);
  return ({
    id,
    name,
    namespace = "",
  }: {
    id: number;
    name: string;
    namespace: string;
  }) => stmt.run({ id, name, namespace });
};

const deleteTag = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM tags WHERE id = ?`);
  return (id: number) => stmt.run(id);
};

const deleteTagsByArchiveId = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM tags WHERE archive_id = ?`);
  return (archive_id: number) => stmt.run(archive_id);
};

const deleteTagByNameAndNamespace = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM tags WHERE name = ? AND namespace = ?`);
  return (name = "", namespace = "") => stmt.run(name, namespace);
};

const deleteTagByArchiveIdAndTagData = (db: Database) => {
  const stmt = db.prepare(
    `DELETE FROM tags WHERE archive_id = ? AND name = ? AND namespace = ?`,
  );
  return ({
    archive_id,
    name,
    namespace,
  }: {
    archive_id: number;
    name: string;
    namespace: string;
  }) => stmt.run(archive_id, name, namespace);
};

export const initTagsQueries = (db: Database) => ({
  addTag: addTag(db),
  addTags: addTags(db),
  deleteTag: deleteTag(db),
  deleteTagsByArchiveId: deleteTagsByArchiveId(db),
  deleteTagByArchiveIdAndTagData: deleteTagByArchiveIdAndTagData(db),
  deleteTagByNameAndNamespace: deleteTagByNameAndNamespace(db),
  getTagsByArchiveId: getTagsByArchiveId(db),
  getTagsByArchiveIdNameAndNamespace: getTagsByArchiveIdNameAndNamespace(db),
  getTagsByName: getTagsByName(db),
  getTagByNameAndNamespace: getTagByNameAndNamespace(db),
  getTagsByNamespace: getTagsByNamespace(db),
  searchTags: searchTags(db),
  updateTag: updateTag(db),
});

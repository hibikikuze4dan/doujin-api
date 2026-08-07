import { type Database } from "better-sqlite3";
import { type Tag } from "../../types/database";
import { type GetTagsSearchByParameter } from "./types";

const addTag = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO tag (id, category_id, name)
    VALUES (@id, @category_id, @name)
  `);
  return ({ category_id, name }: { category_id: number; name: string }) =>
    stmt.run({ category_id, name });
};

//TODO: Make a util for adding multiple tag + tag categories at once
const addTags = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO tag (id, name)
    VALUES (@id, @name)
  `);
  const insertMany = db.transaction((tags) => {
    for (const tag of tags) {
      stmt.run({ namespace: "", ...tag });
    }
  });
  return (tags: { archive_id: number; name: string; namespace: string }[]) =>
    insertMany(tags);
};

const getTag = (db: Database) => {
  const stmt = db.prepare(`SELECT * FROM tag WHERE id = ?`);
  return (id: number) => stmt.get(id) as Tag | undefined;
};

const getTags = (db: Database) => {
  const categoryStmt = db.prepare(`
    SELECT t.* FROM tag t
    WHERE category_id = (SELECT id FROM tag_category WHERE name = ?)
  `);
  const categoryIdStmt = db.prepare(`
    SELECT t.* FROM tag t WHERE category_id = ?
  `);
  const nameStmt = db.prepare(`
    SELECT t.* FROM tag t WHERE name = ?
  `);

  return (searchBy: GetTagsSearchByParameter, value: string | number) => {
    if (searchBy === "category") {
      return categoryStmt.all(value) as Tag[];
    } else if (searchBy === "category_id") {
      return categoryIdStmt.all(value) as Tag[];
    } else if (searchBy === "name") {
      return nameStmt.all(value) as Tag[];
    } else {
      return [];
    }
  };
};

//TODO: Make a util for getting a tag by its name and namespace
const getTagByNameAndNamespace = (db: Database) => {
  const stmt = db.prepare(`SELECT * FROM tag WHERE name = ?`);
  return (name = "", namespace = "") =>
    stmt.get(name, namespace) as Tag | undefined;
};

const updateTag = (db: Database) => {
  const stmt = db.prepare(`
    UPDATE tag
    SET name = @name
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
  const stmt = db.prepare(`DELETE FROM tag WHERE id = ?`);
  return (id: number) => stmt.run(id);
};

const deleteTagsByArchiveId = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM tag WHERE id = ?`);
  return (archive_id: number) => stmt.run(archive_id);
};

const deleteTagByNameAndNamespace = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM tag WHERE name = ?`);
  return (name = "", namespace = "") => stmt.run(name, namespace);
};

const deleteTagByArchiveIdAndTagData = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM tag WHERE id = ? AND name = ?`);
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
  getTag: getTag(db),
  getTags: getTags(db),
  getTagByNameAndNamespace: getTagByNameAndNamespace(db),
  updateTag: updateTag(db),
});

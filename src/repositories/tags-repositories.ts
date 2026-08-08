import { type Database } from "better-sqlite3";
import { type Tag } from "../../types/database";
import { type GetTagsSearchByParameter } from "./types";

const addTag = (db: Database) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO tag (category_id, name)
    VALUES (@category_id, @name)
  `);
  return ({
    category_id,
    name,
  }: {
    category_id: number | null;
    name: string;
  }) => stmt.run({ category_id, name });
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
  const nameAndCategoryStmt = db.prepare(`
    SELECT * FROM tag
    WHERE name = @name
      AND category_id = @category_id
  `);

  return (
    searchBy: "id" | "[name, category_id]",
    value: number | bigint | [string, number | bigint | null],
  ) => {
    if (searchBy === "id") {
      return stmt.get(value) as Tag | undefined;
    } else if (searchBy === "[name, category_id]") {
      if (Array.isArray(value)) {
        return nameAndCategoryStmt.get({
          name: value[0],
          category_id: value[1],
        }) as Tag | undefined;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };
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
    SET name = @name, category_id = @category_id
    WHERE id = @id
  `);
  return ({
    id,
    name,
    category_id,
  }: {
    id: number;
    name: string;
    category_id: number | null;
  }) => stmt.run({ id, name, category_id });
};

const deleteTag = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM tag WHERE id = ?`);
  return (id: number) => stmt.run(id);
};

export const initTagsQueries = (db: Database) => ({
  addTag: addTag(db),
  addTags: addTags(db),
  deleteTag: deleteTag(db),
  getTag: getTag(db),
  getTags: getTags(db),
  getTagByNameAndNamespace: getTagByNameAndNamespace(db),
  updateTag: updateTag(db),
});

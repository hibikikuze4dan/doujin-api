import { type Database } from "better-sqlite3";
import { type TagCategory } from "../../types/database";

const getTagCategory = (db: Database) => {
  const idStmt = db.prepare(`
    SELECT t.id, t.name FROM tag_category t WHERE id = ?
  `);
  const nameStmt = db.prepare(`
    SELECT t.id, t.name FROM tag_category t WHERE name = ?
  `);

  return ({ id, name }: { id?: number; name?: string }) => {
    if (!Number.isNaN(id)) {
      return idStmt.get(id) as TagCategory;
    } else if (name) {
      return nameStmt.get(name) as TagCategory;
    } else {
      return null;
    }
  };
};

const addTagCategory = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO tag_category (name)
    VALUES (@name)
  `);

  return ({ name }: { name: string }) => stmt.run({ name });
};

const deleteTagCategory = (db: Database) => {
  const idStmt = db.prepare(`
    DELETE FROM tag_category WHERE id = ?
  `);
  const nameStmt = db.prepare(`
    DELETE FROM tag_category WHERE id = ?
  `);

  return ({ id, name }: { id?: number; name?: string }) => {
    if (!Number.isNaN(id)) {
      return idStmt.run(id);
    } else if (name) {
      return nameStmt.run(name);
    } else {
      return null;
    }
  };
};

export const initTagCategoryQueries = (db: Database) => ({
  addTagCategory: addTagCategory(db),
  deleteTagCategory: deleteTagCategory(db),
  getTagCategory: getTagCategory(db),
});

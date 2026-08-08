import { type Database } from "better-sqlite3";
import { type ArchiveTag } from "../../types/database";

const addArchiveTag = (db: Database) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO archive_tag (archive_id, tag_id)
    VALUES (@archive_id, @tag_id)
  `);
  return ({ archive_id, tag_id }: { archive_id: number; tag_id: number }) =>
    stmt.run({ archive_id, tag_id });
};

const deleteArchiveTag = (db: Database) => {
  const stmt = db.prepare(`
    DELETE FROM archive_tag
    WHERE archive_id = ? AND tag_id = ?
  `);

  return ({ archive_id, tag_id }: { archive_id: number; tag_id: number }) =>
    stmt.run(archive_id, tag_id);
};

const getArchiveTag = (db: Database) => {
  const stmt = db.prepare(`
    SELECT * FROM archive_tag
    WHERE id = ?  
  `);

  return (id: number | bigint) => stmt.get(id) as ArchiveTag | undefined;
};

const getArchiveTags = (db: Database) => {
  const archiveIdStmt = db.prepare(`
    SELECT * FROM archive_tag
    WHERE archive_id = ?  
  `);
  const tagIdStmt = db.prepare(`
    SELECT * FROM archive_tag
    WHERE tag_id = ?
  `);

  return (searchBy: "archive_id" | "tag_id", value: number | bigint) => {
    if (searchBy === "archive_id") {
      return archiveIdStmt.all(value) as ArchiveTag[];
    } else if (searchBy === "tag_id") {
      return tagIdStmt.all(value) as ArchiveTag[];
    } else {
      return [];
    }
  };
};

export const initArchiveTagQueries = (db: Database) => ({
  addArchiveTag: addArchiveTag(db),
  deleteArchiveTag: deleteArchiveTag(db),
  getArchiveTag: getArchiveTag(db),
  getArchiveTags: getArchiveTags(db),
});

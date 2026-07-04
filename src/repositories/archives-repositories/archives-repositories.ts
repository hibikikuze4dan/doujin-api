import { type Database } from "better-sqlite3";
import { ARCHIVE_JOINS, ARCHIVE_SELECT } from "./constants";
import { searchArchives } from "./search-archives";
import {
  ArchiveTableAllRespnse,
  ArchiveTableGetResponse,
  ArchiveWithConnectedTableData,
} from "../../../types/database";
import { ArchiveEntryParams } from "./types";

const getAllArchives = (db: Database) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} GROUP BY d.id`,
  );
  return () => stmt.all() as ArchiveWithConnectedTableData[];
};

const getArchiveById = (db: Database) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} WHERE d.id = ? GROUP BY d.id`,
  );
  return (id: string | number) => stmt.get(id) as ArchiveTableGetResponse;
};

const getArchiveByFilepath = (db: Database) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} WHERE d.filepath = ? GROUP BY d.id`,
  );
  return (filepath: string) => stmt.get(filepath) as ArchiveTableGetResponse;
};

const getArchivesByName = (db: Database) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} WHERE d.name LIKE ? GROUP BY d.id ORDER BY d.name`,
  );
  return (name: string) => stmt.all(`%${name}%`) as ArchiveTableAllRespnse;
};

const getNumberOfNewArchivesByFilepaths = (db: Database) => {
  return (filepaths: string[]) => {
    db.prepare(
      `CREATE TEMP TABLE IF NOT EXISTS archive_filepaths_to_search (value TEXT)`,
    ).run();

    const insert = db.prepare(
      `INSERT INTO archive_filepaths_to_search VALUES (?)`,
    );

    const insertMany = db.transaction((file_paths) => {
      for (const path of file_paths) {
        insert.run(path);
      }
    });

    insertMany(filepaths);

    const { count } = db
      .prepare(
        `
        SELECT COUNT(*) as count FROM archive_filepaths_to_search
        WHERE value NOT IN (SELECT filepath FROM archives)
      `,
      )
      .get() as { count: number };

    db.prepare(`DROP TABLE archive_filepaths_to_search`).run();

    return count;
  };
};

const getRandomEntries = (db: Database) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} GROUP BY d.id ORDER BY RANDOM() LIMIT ?`,
  );

  return (limit: number) => stmt.all(limit) as ArchiveTableAllRespnse;
};

const createArchiveEntry = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO archives (name, filepath, date_created, pagecount, size)
    VALUES (@name, @filepath, @date_created, @pagecount, @size)
  `);
  return ({
    name,
    filepath,
    date_created,
    pagecount,
    size,
  }: ArchiveEntryParams) =>
    stmt.run({ name, filepath, date_created, pagecount, size })
      .lastInsertRowid as number;
};

const removeArchiveEntry = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM archives WHERE id = ?`);
  return (id: string | number) => stmt.run(id).changes > 0;
};

const removeArchiveByFilepath = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM archives WHERE filepath = ?`);
  return (filepath: string) => stmt.run(filepath).changes > 0;
};

const updateArchive = (db: Database) => {
  const allowed = ["name", "filepath", "date_created", "pagecount", "size"];
  return (id: string | number, fields: ArchiveEntryParams) => {
    const updates = Object.keys(fields).filter((key) => allowed.includes(key));
    if (updates.length === 0)
      throw new Error("No valid fields provided to update.");
    const setClause = updates.map((key) => `${key} = @${key}`).join(", ");
    return (
      db
        .prepare(`UPDATE archives SET ${setClause} WHERE id = @id`)
        .run({ ...fields, id }).changes > 0
    );
  };
};

export const initArchivesQueries = (db: Database) => ({
  getAllArchives: getAllArchives(db),
  getArchiveById: getArchiveById(db),
  getArchiveByFilepath: getArchiveByFilepath(db),
  getArchivesByName: getArchivesByName(db),
  getNumberOfNewArchivesByFilepaths: getNumberOfNewArchivesByFilepaths(db),
  getRandomEntries: getRandomEntries(db),
  createArchiveEntry: createArchiveEntry(db),
  updateArchive: updateArchive(db),
  removeArchiveEntry: removeArchiveEntry(db),
  removeArchiveByFilepath: removeArchiveByFilepath(db),
  searchArchives: searchArchives(db),
});

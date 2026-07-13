import Database from "better-sqlite3";
import {
  ARCHIVE_FTS_MIGRATION,
  ARCHIVE_FTS_TRIGGERS_MIGRATION,
  ARCHIVES_TAGS_FTS_MIGRATION,
  ARCHIVES_TAGS_FTS_TRIGGERS_MIGRATION,
  ARCHIVE_HISTORY_MIGRATION,
  ARCHIVE_INDEX_MIGRATION,
  ARCHIVE_RATING_MIGRATION,
  ARCHIVES_MIGRATION,
  AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION,
  COLLECTION_ARCHIVES_MIGRATION,
  COLLECTIONS_MIGRATION,
  TAGS_FTS_MIGRATION,
  TAGS_FTS_TRIGGERS_MIGRATION,
  TAGS_MIGRATION,
  USERS_MIGRATION,
} from "../../../db/migrate";
import { searchArchives } from "./searchArchives";

describe("searchArchives", () => {
  it("supports fts5 text matching with pagination and rating filtering", () => {
    const db = new Database(":memory:");

    db.exec(ARCHIVES_MIGRATION);
    db.exec(ARCHIVE_INDEX_MIGRATION);
    db.exec(ARCHIVE_HISTORY_MIGRATION);
    db.exec(USERS_MIGRATION);
    db.exec(ARCHIVE_RATING_MIGRATION);
    db.exec(AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION);
    db.exec(COLLECTIONS_MIGRATION);
    db.exec(COLLECTION_ARCHIVES_MIGRATION);
    db.exec(TAGS_MIGRATION);
    db.exec(ARCHIVE_FTS_MIGRATION);
    db.exec(ARCHIVE_FTS_TRIGGERS_MIGRATION);
    db.exec(ARCHIVES_TAGS_FTS_MIGRATION);
    db.exec(ARCHIVES_TAGS_FTS_TRIGGERS_MIGRATION);
    db.exec(TAGS_FTS_MIGRATION);
    db.exec(TAGS_FTS_TRIGGERS_MIGRATION);

    const insertArchive = db.prepare(`
      INSERT INTO archives (id, name, filepath, pagecount, size, rating)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertArchive.run(1, "black clover", "/a.cbz", 10, 100, 5);
    insertArchive.run(2, "demon slayer", "/b.cbz", 12, 200, 7);
    insertArchive.run(3, "dragon ball z", "/c.cbz", 8, 150, 9);
    insertArchive.run(4, "demon king", "/d.cbz", 30, 500, 9);

    const search = searchArchives(db);
    const { archives, totalResults } = search({
      q: "demon",
      min_rating: 1,
      page: 2,
      archivesPerPage: 1,
      sort_by: "rating",
      sort_direction: "desc",
    });

    expect(totalResults).toBe(2);
    expect(archives).toHaveLength(1);
    expect(archives[0]?.name).toBe("demon slayer");
  });

  it("supports multi-word search queries with combined FTS", () => {
    const db = new Database(":memory:");

    db.exec(ARCHIVES_MIGRATION);
    db.exec(ARCHIVE_INDEX_MIGRATION);
    db.exec(ARCHIVE_HISTORY_MIGRATION);
    db.exec(USERS_MIGRATION);
    db.exec(ARCHIVE_RATING_MIGRATION);
    db.exec(AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION);
    db.exec(COLLECTIONS_MIGRATION);
    db.exec(COLLECTION_ARCHIVES_MIGRATION);
    db.exec(TAGS_MIGRATION);
    db.exec(ARCHIVE_FTS_MIGRATION);
    db.exec(ARCHIVE_FTS_TRIGGERS_MIGRATION);
    db.exec(ARCHIVES_TAGS_FTS_MIGRATION);
    db.exec(ARCHIVES_TAGS_FTS_TRIGGERS_MIGRATION);
    db.exec(TAGS_FTS_MIGRATION);
    db.exec(TAGS_FTS_TRIGGERS_MIGRATION);

    const insertArchive = db.prepare(`
      INSERT INTO archives (id, name, filepath, pagecount, size, rating)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertArchive.run(1, "demon slayer", "/a.cbz", 10, 100, 9);
    insertArchive.run(2, "slayer demon", "/b.cbz", 12, 200, 8);
    insertArchive.run(3, "demon king", "/c.cbz", 8, 150, 7);

    const search = searchArchives(db);
    const { archives, totalResults } = search({
      q: "demon slayer",
      q_mode: "and",
      page: 1,
      archivesPerPage: 10,
    });

    expect(totalResults).toBe(2);
    expect(archives.map((archive) => archive.name).sort()).toEqual(
      ["demon slayer", "slayer demon"].sort(),
    );
  });

  it("uses the FTS indexing tables in the generated SQL", () => {
    const db = new Database(":memory:");

    db.exec(ARCHIVES_MIGRATION);
    db.exec(ARCHIVE_INDEX_MIGRATION);
    db.exec(ARCHIVE_HISTORY_MIGRATION);
    db.exec(USERS_MIGRATION);
    db.exec(ARCHIVE_RATING_MIGRATION);
    db.exec(AVERAGE_ARCHIVE_RATING_TRIGGER_UPDATE_MIGRATION);
    db.exec(COLLECTIONS_MIGRATION);
    db.exec(COLLECTION_ARCHIVES_MIGRATION);
    db.exec(TAGS_MIGRATION);
    db.exec(ARCHIVE_FTS_MIGRATION);
    db.exec(ARCHIVE_FTS_TRIGGERS_MIGRATION);
    db.exec(ARCHIVES_TAGS_FTS_MIGRATION);
    db.exec(ARCHIVES_TAGS_FTS_TRIGGERS_MIGRATION);
    db.exec(TAGS_FTS_MIGRATION);
    db.exec(TAGS_FTS_TRIGGERS_MIGRATION);

    db.prepare(
      `INSERT INTO archives (id, name, filepath, pagecount, size, rating)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).run(1, "black clover", "/a.cbz", 10, 100, 5);
    db.prepare(
      `INSERT INTO tags (id, archive_id, name, namespace)
       VALUES (?, ?, ?, ?)`,
    ).run(1, 1, "shounen", "");

    db.prepare(
      `INSERT INTO archives_fts(rowid, name) SELECT id, name FROM archives`,
    ).run();
    db.prepare(
      `INSERT INTO tags_fts(rowid, tag_text)
       SELECT id, CASE WHEN namespace = '' THEN name ELSE namespace || ':' || name END
       FROM tags`,
    ).run();

    const preparedStatements: string[] = [];
    const originalPrepare = db.prepare.bind(db);

    db.prepare = ((sql: string) => {
      preparedStatements.push(sql);
      return originalPrepare(sql);
    }) as typeof db.prepare;

    searchArchives(db)({ q: "shounen" });

    const sqlText = preparedStatements.join("\n");

    expect(sqlText).toContain("archives_tags_fts");
  });
});

const { ARCHIVE_SELECT, ARCHIVE_JOINS } = require("./constants");
const { searchArchives } = require("./search-archives");

const getAllArchives = (db) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} GROUP BY d.id`,
  );
  return () => stmt.all();
};

const getArchiveById = (db) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} WHERE d.id = ? GROUP BY d.id`,
  );
  return (id) => stmt.get(id);
};

const getArchiveByFilepath = (db) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} WHERE d.filepath = ? GROUP BY d.id`,
  );
  return (filepath) => stmt.get(filepath);
};

const getArchivesByName = (db) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} WHERE d.name LIKE ? GROUP BY d.id ORDER BY d.name`,
  );
  return (name) => stmt.all(`%${name}%`);
};

const getArchivesByNameOrTags =
  (db) =>
  (query = "") => {
    const terms = query.trim().split(",").filter(Boolean).slice(0, 10);

    if (terms.length === 0) {
      return { results: [], total: 0 };
    }

    const termClause = () => `
    (
      d.name     LIKE '%' || ? || '%' COLLATE NOCASE OR
      d.filepath LIKE '%' || ? || '%' COLLATE NOCASE OR
      t.name     LIKE '%' || ? || '%' COLLATE NOCASE OR
      (t.namespace || ':' || t.name) LIKE '%' || ? || '%' COLLATE NOCASE
    )`;

    const whereClause = terms.map(() => termClause()).join("\n  AND ");

    // Each term appears 4 times in its clause (once per OR branch)
    const termParams = terms.flatMap((term) => [term, term, term, term]);

    const baseQuery = `
    SELECT ${ARCHIVE_SELECT}
    ${ARCHIVE_JOINS}
    WHERE ${whereClause}
    GROUP BY d.id
  `;

    const total = db
      .prepare(`SELECT COUNT(*) AS total FROM (${baseQuery})`)
      .get(termParams).total;

    const results = db
      .prepare(`${baseQuery} ORDER BY d.name`)
      .all([...termParams]);

    return { results, total };
  };

const getNumberOfNewArchivesByFilepaths = (db) => {
  return (filepaths) => {
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
      .get();

    db.prepare(`DROP TABLE archive_filepaths_to_search`).run();

    return count;
  };
};

const getRandomEntries = (db) => {
  const stmt = db.prepare(
    `SELECT ${ARCHIVE_SELECT} ${ARCHIVE_JOINS} GROUP BY d.id ORDER BY RANDOM() LIMIT ?`,
  );

  return (limit) => stmt.all(limit);
};

const createArchiveEntry = (db) => {
  const stmt = db.prepare(`
    INSERT INTO archives (name, filepath, date_created, pagecount, size)
    VALUES (@name, @filepath, @date_created, @pagecount, @size)
  `);
  return ({ name, filepath, date_created, pagecount, size }) =>
    stmt.run({ name, filepath, date_created, pagecount, size }).lastInsertRowid;
};

const removeArchiveEntry = (db) => {
  const stmt = db.prepare(`DELETE FROM archives WHERE id = ?`);
  return (id) => stmt.run(id).changes > 0;
};

const removeArchiveByFilepath = (db) => {
  const stmt = db.prepare(`DELETE FROM archives WHERE filepath = ?`);
  return (filepath) => stmt.run(filepath).changes > 0;
};

const updateArchive = (db) => {
  const allowed = ["name", "filepath", "date_created", "pagecount", "size"];
  return (id, fields) => {
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

exports.initArchivesQueries = (db) => ({
  getAllArchives: getAllArchives(db),
  getArchiveById: getArchiveById(db),
  getArchiveByFilepath: getArchiveByFilepath(db),
  getArchivesByName: getArchivesByName(db),
  getArchivesByNameOrTags: getArchivesByNameOrTags(db),
  getNumberOfNewArchivesByFilepaths: getNumberOfNewArchivesByFilepaths(db),
  getRandomEntries: getRandomEntries(db),
  createArchiveEntry: createArchiveEntry(db),
  updateArchive: updateArchive(db),
  removeArchiveEntry: removeArchiveEntry(db),
  removeArchiveByFilepath: removeArchiveByFilepath(db),
  searchArchives: searchArchives(db),
});

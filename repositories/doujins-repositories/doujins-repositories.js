const { searchArchives } = require("./search-archives");

const getAllArchives = (db) => {
  const stmt = db.prepare(`SELECT * FROM archives`);
  return () => stmt.all();
};

const getArchiveById = (db) => {
  const stmt = db.prepare(`SELECT * FROM archives WHERE id = ?`);
  return (id) => stmt.get(id);
};

const getArchiveByFilepath = (db) => {
  const stmt = db.prepare(`SELECT * FROM archives WHERE filepath = ?`);
  return (filepath) => stmt.get(filepath);
};

const getArchivesByName = (db) => {
  const stmt = db.prepare(`SELECT * FROM archives WHERE name LIKE ?`);
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
    SELECT DISTINCT
      d.id,
      d.name,
      d.filepath,
      d.date_added,
      d.date_created,
      d.pagecount,
      d.size
    FROM archives d
    LEFT JOIN tags t ON t.archive_id = d.id
    WHERE ${whereClause}
  `;

    const total = db
      .prepare(`SELECT COUNT(*) AS total FROM (${baseQuery})`)
      .get(termParams).total;

    const results = db
      .prepare(`${baseQuery} ORDER BY d.name`)
      .all([...termParams]);

    return { results, total };
  };

const getRandomEntries = (db) => {
  const stmt = db.prepare(`SELECT * FROM archives ORDER BY RANDOM() LIMIT ?`);
  return (count) => stmt.all(count);
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

exports.initDoujinQueries = (db) => ({
  getAllArchives: getAllArchives(db),
  getArchiveById: getArchiveById(db),
  getArchiveByFilepath: getArchiveByFilepath(db),
  getArchivesByName: getArchivesByName(db),
  getArchivesByNameOrTags: getArchivesByNameOrTags(db),
  getRandomEntries: getRandomEntries(db),
  createArchiveEntry: createArchiveEntry(db),
  updateArchive: updateArchive(db),
  removeArchiveEntry: removeArchiveEntry(db),
  removeArchiveByFilepath: removeArchiveByFilepath(db),
  searchArchives: searchArchives(db),
});

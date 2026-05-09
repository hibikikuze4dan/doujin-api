const getAllDoujins = (db) => {
  const stmt = db.prepare(`SELECT * FROM doujins`);
  return () => stmt.all();
};

const getDoujinById = (db) => {
  const stmt = db.prepare(`SELECT * FROM doujins WHERE id = ?`);
  return (id) => stmt.get(id);
};

const getDoujinByFilepath = (db) => {
  const stmt = db.prepare(`SELECT * FROM doujins WHERE filepath = ?`);
  return (filepath) => stmt.get(filepath);
};

const getDoujinsByName = (db) => {
  const stmt = db.prepare(`SELECT * FROM doujins WHERE name LIKE ?`);
  return (name) => stmt.all(`%${name}%`);
};

const getRandomEntries = (db) => {
  const stmt = db.prepare(`SELECT * FROM doujins ORDER BY RANDOM() LIMIT ?`);
  return (count) => stmt.all(count);
};

const createDoujinEntry = (db) => {
  const stmt = db.prepare(`
    INSERT INTO doujins (name, filepath, date_created, pagecount, size)
    VALUES (@name, @filepath, @date_created, @pagecount, @size)
  `);
  return ({ name, filepath, date_created, pagecount, size }) =>
    stmt.run({ name, filepath, date_created, pagecount, size }).lastInsertRowid;
};

const removeDoujinEntry = (db) => {
  const stmt = db.prepare(`DELETE FROM doujins WHERE id = ?`);
  return (id) => stmt.run(id).changes > 0;
};

const removeDoujinByFilepath = (db) => {
  const stmt = db.prepare(`DELETE FROM doujins WHERE filepath = ?`);
  return (filepath) => stmt.run(filepath).changes > 0;
};

const updateDoujin = (db) => {
  const allowed = ["name", "filepath", "date_created", "pagecount", "size"];
  return (id, fields) => {
    const updates = Object.keys(fields).filter((key) => allowed.includes(key));
    if (updates.length === 0)
      throw new Error("No valid fields provided to update.");
    const setClause = updates.map((key) => `${key} = @${key}`).join(", ");
    return (
      db
        .prepare(`UPDATE doujins SET ${setClause} WHERE id = @id`)
        .run({ ...fields, id }).changes > 0
    );
  };
};

exports.initDoujinQueries = (db) => ({
  getAllDoujins: getAllDoujins(db),
  getDoujinById: getDoujinById(db),
  getDoujinByFilepath: getDoujinByFilepath(db),
  getDoujinsByName: getDoujinsByName(db),
  getRandomEntries: getRandomEntries(db),
  createDoujinEntry: createDoujinEntry(db),
  updateDoujin: updateDoujin(db),
  removeDoujinEntry: removeDoujinEntry(db),
  removeDoujinByFilepath: removeDoujinByFilepath(db),
});

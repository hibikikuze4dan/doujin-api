const db = require("../db");

const getAllDoujins = () => {
  const statement = db.prepare("SELECT * FROM doujins");
  const doujins = statement.all();
  return doujins;
};

const getDoujinById = (id) => {
  const statement = db.prepare("SELECT * FROM doujins WHERE id = ?");
  const doujin = statement.get(id);
  return doujin;
};

const getDoujinByFilepath = (filepath) => {
  const statement = db.prepare(`SELECT * FROM doujins WHERE filepath = ?`);
  const doujin = statement.get(filepath);
  return doujin;
};

const getDoujinsByName = (name) => {
  const statement = db.prepare(`SELECT * FROM doujins WHERE name LIKE ?`);
  const doujins = statement.all(`%${name}%`);
  return doujins;
};

const getDoujinsByTags = (tags) => {
  const tagList = Array.isArray(tags) ? tags : [tags];
  const conditions = tagList.map(() => `tags LIKE ?`).join(" AND ");
  const params = tagList.map((tag) => `%${tag}%`);

  const statement = db.prepare(`SELECT * FROM doujins WHERE ${conditions}`);
  const doujins = statement.all(...params);
  return doujins;
};

const createDoujinEntry = ({
  name,
  filepath,
  tags,
  date_created,
  pagecount,
  size,
}) => {
  const statement = db.prepare(`
  INSERT INTO doujins (name, filepath, tags, date_created, pagecount, size)
  VALUES (@name, @tags, @date_created, @pagecount, @size)
`);

  const result = statement.run({
    name,
    filepath,
    tags,
    date_created,
    pagecount,
    size,
  });

  return result.lastInsertRowid;
};

const updateDoujin = (id, fields) => {
  const allowed = [
    "name",
    "filepath",
    "tags",
    "date_created",
    "pagecount",
    "size",
  ];
  const updates = Object.keys(fields).filter((key) => allowed.includes(key));

  if (updates.length === 0)
    throw new Error("No valid fields provided to update.");

  const setClause = updates.map((key) => `${key} = @${key}`).join(", ");
  const statement = db.prepare(
    `UPDATE doujins SET ${setClause} WHERE id = @id`,
  );

  const result = statement.run({ ...fields, id });
  return result.changes > 0;
};

const removeDoujinEntry = (id) => {
  const statement = db.prepare("DELETE FROM doujins WHERE id = ?");
  const result = statement.run(id);
  return result.changes > 0;
};

const removeDoujinByFilepath = (filepath) => {
  const statement = db.prepare(`DELETE FROM doujins WHERE filepath = ?`);
  const result = statement.run(filepath);
  return result.changes > 0;
};

module.exports = {
  createDoujinEntry,
  getAllDoujins,
  getDoujinByFilepath,
  getDoujinById,
  getDoujinsByName,
  getDoujinsByTags,
  removeDoujinEntry,
  removeDoujinByFilepath,
  updateDoujin,
};

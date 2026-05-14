// CREATE

const addTag = (db) => {
  const stmt = db.prepare(`
    INSERT INTO tags (archive_id, name, namespace)
    VALUES (@archive_id, @name, @namespace)
  `);
  return ({ archive_id, name, namespace = "" }) =>
    stmt.run({ archive_id, name, namespace });
};

const addTags = (db) => {
  const stmt = db.prepare(`
    INSERT INTO tags (archive_id, name, namespace)
    VALUES (@archive_id, @name, @namespace)
  `);
  const insertMany = db.transaction((tags) => {
    for (const tag of tags) {
      stmt.run({ namespace: "", ...tag });
    }
  });
  return (tags) => insertMany(tags);
};

// READ

const getTagsByDoujinId = (db) => {
  const stmt = db.prepare(`SELECT * FROM tags WHERE archive_id = ?`);
  return (archive_id) => stmt.all(archive_id);
};

const getTagsByName = (db) => {
  const stmt = db.prepare(`SELECT * FROM tags WHERE name = ?`);
  return (name) => stmt.all(name);
};

const getTagsByNamespace = (db) => {
  const stmt = db.prepare(`SELECT * FROM tags WHERE namespace = ?`);
  return (namespace) => stmt.all(namespace);
};

const getTagByNameAndNamespace = (db) => {
  const stmt = db.prepare(
    `SELECT * FROM tags WHERE name = ? AND namespace = ?`,
  );
  return (name, namespace = "") => stmt.get(name, namespace);
};

// UPDATE

const updateTag = (db) => {
  const stmt = db.prepare(`
    UPDATE tags
    SET name = @name, namespace = @namespace
    WHERE id = @id
  `);
  return ({ id, name, namespace = "" }) => stmt.run({ id, name, namespace });
};

// DELETE

const deleteTag = (db) => {
  const stmt = db.prepare(`DELETE FROM tags WHERE id = ?`);
  return (id) => stmt.run(id);
};

const deleteTagsByDoujinId = (db) => {
  const stmt = db.prepare(`DELETE FROM tags WHERE archive_id = ?`);
  return (archive_id) => stmt.run(archive_id);
};

const deleteTagByNameAndNamespace = (db) => {
  const stmt = db.prepare(`DELETE FROM tags WHERE name = ? AND namespace = ?`);
  return (name, namespace = "") => stmt.run(name, namespace);
};

exports.initTagsQueries = (db) => ({
  addTag: addTag(db),
  addTags: addTags(db),
  deleteTag: deleteTag(db),
  deleteTagsByDoujinId: deleteTagsByDoujinId(db),
  deleteTagByNameAndNamespace: deleteTagByNameAndNamespace(db),
  getTagsByDoujinId: getTagsByDoujinId(db),
  getTagsByName: getTagsByName(db),
  getTagByNameAndNamespace: getTagByNameAndNamespace(db),
  getTagsByNamespace: getTagsByNamespace(db),
  updateTag: updateTag(db),
});

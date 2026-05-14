const createCollection = (db) => {
  const stmt = db.prepare(`
    INSERT INTO collections (name, description)
    VALUES (?, ?)
  `);
  return (name, description = "") => stmt.run(name, description);
};

const getAllCollections = (db) => {
  const stmt = db.prepare(`SELECT * FROM collections`);
  return () => stmt.all();
};

const getCollectionById = (db) => {
  const stmt = db.prepare(`SELECT * FROM collections WHERE id = ?`);
  return (id) => stmt.get(id);
};

const addDoujinToCollection = (db) => {
  const stmt = db.prepare(`
    INSERT INTO collection_doujins (collection_id, archive_id)
    VALUES (?, ?)
  `);
  return (collectionId, doujinId) => stmt.run(collectionId, doujinId);
};

const removeDoujinFromCollection = (db) => {
  const stmt = db.prepare(`
    DELETE FROM collection_doujins
    WHERE collection_id = ? AND archive_id = ?
  `);
  return (collectionId, doujinId) => stmt.run(collectionId, doujinId);
};

const getDoujinsInCollection = (db) => {
  const stmt = db.prepare(`
    SELECT d.* FROM doujins d
    JOIN collection_doujins cd ON cd.archive_id = d.id
    WHERE cd.collection_id = ?
  `);
  return (collectionId) => stmt.all(collectionId);
};

const getCollectionsForDoujin = (db) => {
  const stmt = db.prepare(`
    SELECT c.* FROM collections c
    JOIN collection_doujins cd ON cd.collection_id = c.id
    WHERE cd.archive_id = ?
  `);
  return (doujinId) => stmt.all(doujinId);
};

const removeCollectionById = (db) => {
  const stmt = db.prepare(`
    DELETE FROM collections WHERE id = ?
  `);

  return (collectionId) => stmt.run(collectionId);
};

const removeCollectionByName = (db) => {
  const stmt = db.prepare(`
    DELETE FROM collections WHERE name = ?
  `);

  return (collectionName) => stmt.run(collectionName);
};

exports.initCollectionQueries = (db) => ({
  addDoujinToCollection: addDoujinToCollection(db),
  createCollection: createCollection(db),
  getAllCollections: getAllCollections(db),
  getCollectionById: getCollectionById(db),
  getCollectionsForDoujin: getCollectionsForDoujin(db),
  getDoujinsInCollection: getDoujinsInCollection(db),
  removeCollectionById: removeCollectionById(db),
  removeCollectionByName: removeCollectionByName(db),
  removeDoujinFromCollection: removeDoujinFromCollection(db),
});

const createCollection = (db) => {
  const stmt = db.prepare(`
    INSERT INTO collections (name, description)
    VALUES (?, ?)
  `);
  return (name, description = "") => stmt.run(name, description);
};

const addDoujinToCollection = (db) => {
  const stmt = db.prepare(`
    INSERT INTO collection_doujins (collection_id, doujin_id)
    VALUES (?, ?)
  `);
  return (collectionId, doujinId) => stmt.run(collectionId, doujinId);
};

const removeDoujinFromCollection = (db) => {
  const stmt = db.prepare(`
    DELETE FROM collection_doujins
    WHERE collection_id = ? AND doujin_id = ?
  `);
  return (collectionId, doujinId) => stmt.run(collectionId, doujinId);
};

const getDoujinsInCollection = (db) => {
  const stmt = db.prepare(`
    SELECT d.* FROM doujins d
    JOIN collection_doujins cd ON cd.doujin_id = d.id
    WHERE cd.collection_id = ?
  `);
  return (collectionId) => stmt.all(collectionId);
};

const getCollectionsForDoujin = (db) => {
  const stmt = db.prepare(`
    SELECT c.* FROM collections c
    JOIN collection_doujins cd ON cd.collection_id = c.id
    WHERE cd.doujin_id = ?
  `);
  return (doujinId) => stmt.all(doujinId);
};

exports.initCollectionQueries = (db) => ({
  createCollection: createCollection(db),
  addDoujinToCollection: addDoujinToCollection(db),
  removeDoujinFromCollection: removeDoujinFromCollection(db),
  getDoujinsInCollection: getDoujinsInCollection(db),
  getCollectionsForDoujin: getCollectionsForDoujin(db),
});

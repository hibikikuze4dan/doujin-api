const {
  ARCHIVE_SELECT,
  ARCHIVE_JOINS,
} = require("./archives-repositories/constants");

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

const addArchiveToCollection = (db) => {
  const stmt = db.prepare(`
    INSERT INTO collection_archives (collection_id, archive_id)
    VALUES (?, ?)
  `);
  return (collectionId, archiveId) => stmt.run(collectionId, archiveId);
};

const removeArchiveFromCollection = (db) => {
  const stmt = db.prepare(`
    DELETE FROM collection_archives
    WHERE collection_id = ? AND archive_id = ?
  `);
  return (collectionId, archiveId) => stmt.run(collectionId, archiveId);
};

const getArchivesInCollection = (db) => {
  const stmt = db.prepare(`
    SELECT  
      ${ARCHIVE_SELECT}
    ${ARCHIVE_JOINS}
    JOIN collection_archives cd ON cd.archive_id = d.id
    WHERE cd.collection_id = ?
    GROUP BY d.id
  `);
  return (collectionId) => stmt.all(collectionId);
};

const getCollectionsForArchive = (db) => {
  const stmt = db.prepare(`
    SELECT c.* FROM collections c
    JOIN collection_archives cd ON cd.collection_id = c.id
    WHERE cd.archive_id = ?
  `);
  return (archiveId) => stmt.all(archiveId);
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
  addArchiveToCollection: addArchiveToCollection(db),
  createCollection: createCollection(db),
  getAllCollections: getAllCollections(db),
  getCollectionById: getCollectionById(db),
  getCollectionsForArchive: getCollectionsForArchive(db),
  getArchivesInCollection: getArchivesInCollection(db),
  removeCollectionById: removeCollectionById(db),
  removeCollectionByName: removeCollectionByName(db),
  removeArchiveFromCollection: removeArchiveFromCollection(db),
});

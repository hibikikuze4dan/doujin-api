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
      d.id,
      d.name,
      d.filepath,
      d.date_added,
      d.date_created,
      d.pagecount,
      d.size,
      COALESCE(ar.avg_rating, 0) AS rating,
      REPLACE(GROUP_CONCAT(DISTINCT CASE WHEN t.namespace = '' THEN t.name ELSE t.namespace || ':' || t.name END), ',', ', ') AS tags
    FROM archives d
    JOIN collection_archives cd ON cd.archive_id = d.id
    LEFT JOIN tags t ON t.archive_id = d.id
    LEFT JOIN (
      SELECT archive_id, AVG(rating) AS avg_rating
      FROM archive_rating
      GROUP BY archive_id
    ) ar ON ar.archive_id = d.id
    WHERE cd.collection_id = ?
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

import { type Database } from "better-sqlite3";
import {
  ARCHIVE_JOINS,
  ARCHIVE_SELECT,
} from "./archives-repositories/constants";
import {
  type ArchiveTableAllRespnse,
  type Collection,
} from "../../types/database";

const createCollection = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO collections (name, description)
    VALUES (?, ?)
  `);
  return (name: string, description = "") => stmt.run(name, description);
};

const getAllCollections = (db: Database) => {
  const stmt = db.prepare(`SELECT * FROM collections`);
  return () => stmt.all() as Collection[];
};

const getCollectionById = (db: Database) => {
  const stmt = db.prepare(`SELECT * FROM collections WHERE id = ?`);
  return (id: string | number) => stmt.get(id) as Collection;
};

const addArchiveToCollection = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO collection_archives (collection_id, archive_id)
    VALUES (?, ?)
  `);
  return (collectionId: string | number, archiveId: string | number) =>
    stmt.run(collectionId, archiveId);
};

const removeArchiveFromCollection = (db: Database) => {
  const stmt = db.prepare(`
    DELETE FROM collection_archives
    WHERE collection_id = ? AND archive_id = ?
  `);
  return (collectionId: string | number, archiveId: string | number) =>
    stmt.run(collectionId, archiveId);
};

const getArchivesInCollection = (db: Database) => {
  const stmt = db.prepare(`
    SELECT  
      ${ARCHIVE_SELECT}
    ${ARCHIVE_JOINS}
    JOIN collection_archives cd ON cd.archive_id = d.id
    WHERE cd.collection_id = ?
    GROUP BY d.id
  `);
  return (collectionId: string | number) =>
    stmt.all(collectionId) as ArchiveTableAllRespnse[];
};

const getCollectionsForArchive = (db: Database) => {
  const stmt = db.prepare(`
    SELECT c.* FROM collections c
    JOIN collection_archives cd ON cd.collection_id = c.id
    WHERE cd.archive_id = ?
  `);
  return (archiveId: string | number) => stmt.all(archiveId) as Collection[];
};

const removeCollectionById = (db: Database) => {
  const stmt = db.prepare(`
    DELETE FROM collections WHERE id = ?
  `);

  return (collectionId: string | number) => stmt.run(collectionId);
};

const removeCollectionByName = (db: Database) => {
  const stmt = db.prepare(`
    DELETE FROM collections WHERE name = ?
  `);

  return (collectionName: string) => stmt.run(collectionName);
};

export const initCollectionQueries = (db: Database) => ({
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

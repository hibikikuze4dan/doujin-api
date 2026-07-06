import { type Database } from "better-sqlite3";
import {
  ARCHIVE_JOINS,
  ARCHIVE_SELECT,
} from "./archives-repositories/constants";
import {
  type ArchiveTableAllRespnse,
  type Collection,
} from "../../types/database";
import { EPSILON, REBALANCE_SPACING } from "../constants";

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
  const posStmt = db.prepare(
    `
    SELECT COALESCE(MAX(position), 0) AS maxPos
    FROM collection_archives
    WHERE collection_id = ?
  `,
  );

  const insertStmt = db.prepare(
    `
    INSERT INTO collection_archives (collection_id, archive_id, position)
    VALUES (?, ?, ?)
  `,
  );

  return (collectionId: number, archiveId: number) => {
    const { maxPos } = posStmt.get(collectionId) as { maxPos: number };

    const results = insertStmt.run(collectionId, archiveId, maxPos + 2500);

    return results;
  };
};

const removeArchiveFromCollection = (db: Database) => {
  const stmt = db.prepare(`
    DELETE FROM collection_archives
    WHERE collection_id = ? AND archive_id = ?
  `);
  return (collectionId: string | number, archiveId: string | number) =>
    stmt.run(collectionId, archiveId);
};

const reorderArchiveInCollection = (db: Database) => {
  const rowsStmt = db.prepare(`
    SELECT archive_id, position FROM collection_archives
    WHERE collection_id = ? ORDER BY position
  `);

  const updateStmt = db.prepare(`
    UPDATE collection_archives SET position = ?
    WHERE collection_id = ? AND archive_id = ?
  `);

  const rebalance = (collectionId: number) => {
    const rows = rowsStmt.all(collectionId) as {
      archive_id: number;
      position: number;
    }[];

    rows.forEach((row, index) => {
      updateStmt.run(
        (index + 1) * REBALANCE_SPACING,
        collectionId,
        row.archive_id,
      );
    });
  };

  const reorder = (
    collectionId: number,
    archiveId: number,
    beforeArchiveId: number | null,
  ) => {
    // exclude the archive being moved from its own neighbor calculation,
    // otherwise its old slot can produce a bogus tiny gap next to itself
    const rows = (
      rowsStmt.all(collectionId) as { archive_id: number; position: number }[]
    ).filter((r) => r.archive_id !== archiveId);

    const targetIndex = beforeArchiveId
      ? rows.findIndex((r) => r.archive_id === beforeArchiveId)
      : rows.length;

    if (beforeArchiveId !== null && targetIndex === -1) {
      throw new Error(
        `beforeArchiveId ${beforeArchiveId} not found in collection ${collectionId}`,
      );
    }

    const prev = rows[targetIndex - 1]?.position ?? 0;
    const next = rows[targetIndex]?.position ?? prev + REBALANCE_SPACING * 2.5;

    if (next - prev < EPSILON) {
      // gap exhausted — rebalance the whole collection, then retry the move once
      rebalance(collectionId);
      return reorder(collectionId, archiveId, beforeArchiveId);
    }

    const newPosition = (prev + next) / 2;
    return updateStmt.run(newPosition, collectionId, archiveId);
  };

  return db.transaction(reorder);
};

const getArchivesInCollection = (db: Database) => {
  const stmt = db.prepare(`
    SELECT  
      ${ARCHIVE_SELECT}
    ${ARCHIVE_JOINS}
    JOIN collection_archives cd ON cd.archive_id = d.id
    WHERE cd.collection_id = ?
    GROUP BY d.id
    ORDER BY cd.position;

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
  reorderArchiveInCollection: reorderArchiveInCollection(db),
});

import { type Database } from "better-sqlite3";
import { type ArchiveHistory } from "../types/database";

const getAllHistory = (db: Database) => {
  const stmt = db.prepare(`
    SELECT * FROM archive_history
    ORDER BY accessed_at DESC
  `);
  return () => stmt.all() as ArchiveHistory[];
};

const createHistoryEntry = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO archive_history (archive_id, last_page)
    VALUES (@archive_id, @last_page)
  `);

  return ({
    archive_id,
    last_page,
  }: {
    archive_id: number;
    last_page: number;
  }) => stmt.run({ archive_id, last_page: last_page ?? 1 });
};

// TODO: Figure out what to do with this redundant function
// Should limit be an option for all utils where it makes sense?
const getHistorySortedByAccessedAt = (db: Database) => {
  const stmt = db.prepare(`
  SELECT * FROM archive_history
  ORDER BY accessed_at DESC
  LIMIT ?
`);

  return (limit = 1000) => stmt.all(limit) as ArchiveHistory[];
};

const getHistoryByArchiveId = (db: Database) => {
  const stmt = db.prepare(`
    SELECT * FROM archive_history WHERE archive_id = ?
    ORDER BY accessed_at DESC
  `);
  return (archive_id: number) => stmt.all(archive_id) as ArchiveHistory[];
};

const removeAllHistory = (db: Database) => {
  const stmt = db.prepare(`
    DELETE FROM archive_history;  
  `);

  return () => stmt.run();
};

export const initHistoryQueries = (db: Database) => ({
  createHistoryEntry: createHistoryEntry(db),
  getAllHistory: getAllHistory(db),
  getHistoryByArchiveId: getHistoryByArchiveId(db),
  getHistorySortedByAccessedAt: getHistorySortedByAccessedAt(db),
  removeAllHistory: removeAllHistory(db),
});

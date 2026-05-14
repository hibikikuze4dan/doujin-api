const getAllHistory = (db) => {
  const stmt = db.prepare(`
    SELECT * FROM archive_history
    ORDER BY accessed_at DESC
  `);
  return () => stmt.all();
};

const createHistoryEntry = (db) => {
  const stmt = db.prepare(`
    INSERT INTO archive_history (archive_id, last_page)
    VALUES (@archive_id, @last_page)
  `);

  return ({ archive_id, last_page }) =>
    stmt.run({ archive_id, last_page: last_page ?? 1 });
};

// TODO: Figure out what to do with this redundant function
// Should limit be an option for all utils where it makes sense?
const getHistorySortedByAccessedAt = (db) => {
  const stmt = db.prepare(`
  SELECT * FROM archive_history
  ORDER BY accessed_at DESC
  LIMIT ?
`);

  return (limit = 1000) => stmt.all(limit);
};

const getHistoryByDoujinId = (db) => {
  const stmt = db.prepare(`
    SELECT * FROM archive_history WHERE archive_id = ?
    ORDER BY accessed_at DESC
  `);
  return (archive_id) => stmt.all(archive_id);
};

const removeAllHistory = (db) => {
  const stmt = db.prepare(`
    DELETE FROM archive_history;  
  `);

  return () => stmt.run();
};

exports.initHistoryQueries = (db) => ({
  createHistoryEntry: createHistoryEntry(db),
  getAllHistory: getAllHistory(db),
  getHistoryByDoujinId: getHistoryByDoujinId(db),
  getHistorySortedByAccessedAt: getHistorySortedByAccessedAt(db),
  removeAllHistory: removeAllHistory(db),
});

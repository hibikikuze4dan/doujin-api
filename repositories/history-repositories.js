const getAllHistory = (db) => {
  const stmt = db.prepare(`SELECT * FROM doujin_history`);
  return () => stmt.all();
};

const createHistoryEntry = (db) => {
  const stmt = db.prepare(`
    INSERT INTO doujin_history (doujin_id, last_page)
    VALUES (@doujin_id, @last_page)
  `);

  return ({ doujin_id, last_page }) =>
    stmt.run({ doujin_id, last_page: last_page ?? 1 });
};

const getHistorySortedByAccessedAt = (db) => {
  const stmt = db.prepare(`
  SELECT * FROM doujin_history
  ORDER BY accessed_at DESC
  LIMIT ?
`);

  return (limit = 1000) => stmt.all(limit);
};

const getHistoryByDoujinId = (db) => {
  const stmt = db.prepare(`SELECT * FROM doujin_history WHERE doujin_id = ?`);
  return (doujin_id) => stmt.all(doujin_id);
};

exports.initHistoryQueries = (db) => ({
  createHistoryEntry: createHistoryEntry(db),
  getAllHistory: getAllHistory(db),
  getHistoryByDoujinId: getHistoryByDoujinId(db),
  getHistorySortedByAccessedAt: getHistorySortedByAccessedAt(db),
});

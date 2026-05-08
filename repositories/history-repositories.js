const getAllHistory = (db) => {
  const stmt = db.prepare(`
    SELECT * FROM doujin_history
    ORDER BY accessed_at DESC
  `);
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

// TODO: Figure out what to do with this redundant function
// Should limit be an option for all utils where it makes sense?
const getHistorySortedByAccessedAt = (db) => {
  const stmt = db.prepare(`
  SELECT * FROM doujin_history
  ORDER BY accessed_at DESC
  LIMIT ?
`);

  return (limit = 1000) => stmt.all(limit);
};

const getHistoryByDoujinId = (db) => {
  const stmt = db.prepare(`
    SELECT * FROM doujin_history WHERE doujin_id = ?
    ORDER BY accessed_at DESC
  `);
  return (doujin_id) => stmt.all(doujin_id);
};

const removeAllHistory = (db) => {
  const stmt = db.prepare(`
    DELETE FROM doujin_history;  
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

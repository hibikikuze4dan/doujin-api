const getAllRatings = (db) => {
  const stmt = db.prepare(
    `SELECT * FROM archive_rating ORDER BY rated_at DESC`,
  );
  return () => stmt.all();
};

const getRatingsByArchiveId = (db) => {
  const stmt = db.prepare(
    `SELECT * FROM archive_rating WHERE archive_id = ? ORDER BY rated_at DESC`,
  );
  return (archive_id) => stmt.all(archive_id);
};

const getRatingsByUserId = (db) => {
  const stmt = db.prepare(
    `SELECT * FROM archive_rating WHERE user_id = ? ORDER BY rated_at DESC`,
  );
  return (user_id) => stmt.all(user_id);
};

const getRatingByArchiveAndUser = (db) => {
  const stmt = db.prepare(
    `SELECT * FROM archive_rating WHERE archive_id = ? AND user_id = ?`,
  );
  return ({ archive_id, user_id }) => stmt.get(archive_id, user_id);
};

const createRating = (db) => {
  const stmt = db.prepare(`
    INSERT INTO archive_rating (archive_id, user_id, rating)
    VALUES (@archive_id, @user_id, @rating)
  `);

  return ({ archive_id, user_id, rating }) =>
    stmt.run({ archive_id, user_id, rating });
};

const updateRating = (db) => {
  const stmt = db.prepare(`
    UPDATE archive_rating
    SET rating = @rating, rated_at = (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    WHERE archive_id = @archive_id AND user_id = @user_id
  `);

  return ({ archive_id, user_id, rating }) =>
    stmt.run({ archive_id, user_id, rating });
};

const deleteRating = (db) => {
  const stmt = db.prepare(
    `DELETE FROM archive_rating WHERE archive_id = ? AND user_id = ?`,
  );
  return ({ archive_id, user_id }) => stmt.run(archive_id, user_id);
};

const deleteRatingsByArchiveId = (db) => {
  const stmt = db.prepare(`DELETE FROM archive_rating WHERE archive_id = ?`);
  return (archive_id) => stmt.run(archive_id).changes > 0;
};

const deleteRatingsByUserId = (db) => {
  const stmt = db.prepare(`DELETE FROM archive_rating WHERE user_id = ?`);
  return (user_id) => stmt.run(user_id).changes > 0;
};

const deleteAllRatings = (db) => {
  const stmt = db.prepare(`DELETE FROM archive_rating`);
  return () => stmt.run();
};

exports.initRatingRepositories = (db) => ({
  createRating: createRating(db),
  deleteAllRatings: deleteAllRatings(db),
  deleteRating: deleteRating(db),
  deleteRatingsByArchiveId: deleteRatingsByArchiveId(db),
  deleteRatingsByUserId: deleteRatingsByUserId(db),
  getAllRatings: getAllRatings(db),
  getRatingByArchiveAndUser: getRatingByArchiveAndUser(db),
  getRatingsByArchiveId: getRatingsByArchiveId(db),
  getRatingsByUserId: getRatingsByUserId(db),
  updateRating: updateRating(db),
});

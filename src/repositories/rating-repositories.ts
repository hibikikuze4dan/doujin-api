import { type Database } from "better-sqlite3";
import { type ArchiveRating } from "../../types/database";

const getAllRatings = (db: Database) => {
  const stmt = db.prepare(
    `SELECT * FROM archive_rating ORDER BY rated_at DESC`,
  );
  return () => stmt.all() as ArchiveRating[];
};

const getRatingsByArchiveId = (db: Database) => {
  const stmt = db.prepare(
    `SELECT * FROM archive_rating WHERE archive_id = ? ORDER BY rated_at DESC`,
  );
  return (archive_id: number) => stmt.all(archive_id) as ArchiveRating[];
};

const getRatingsByUserId = (db: Database) => {
  const stmt = db.prepare(
    `SELECT * FROM archive_rating WHERE user_id = ? ORDER BY rated_at DESC`,
  );
  return (user_id: number) => stmt.all(user_id) as ArchiveRating[];
};

const getRatingByArchiveAndUser = (db: Database) => {
  const stmt = db.prepare(
    `SELECT * FROM archive_rating WHERE archive_id = ? AND user_id = ?`,
  );
  return ({ archive_id, user_id }: { archive_id: number; user_id: number }) =>
    stmt.get(archive_id, user_id) as ArchiveRating;
};

const createRating = (db: Database) => {
  const stmt = db.prepare(`
    INSERT INTO archive_rating (archive_id, user_id, rating)
    VALUES (@archive_id, @user_id, @rating)
  `);

  return ({
    archive_id,
    user_id,
    rating,
  }: {
    archive_id: number;
    user_id: number;
    rating: number;
  }) => stmt.run({ archive_id, user_id, rating });
};

const updateRating = (db: Database) => {
  const stmt = db.prepare(`
    UPDATE archive_rating
    SET rating = @rating, rated_at = (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    WHERE archive_id = @archive_id AND user_id = @user_id
  `);

  return ({
    archive_id,
    user_id,
    rating,
  }: {
    archive_id: number;
    user_id: number;
    rating: number;
  }) => stmt.run({ archive_id, user_id, rating });
};

const deleteRating = (db: Database) => {
  const stmt = db.prepare(
    `DELETE FROM archive_rating WHERE archive_id = ? AND user_id = ?`,
  );
  return ({ archive_id, user_id }: { archive_id: number; user_id: number }) =>
    stmt.run(archive_id, user_id);
};

const deleteRatingsByArchiveId = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM archive_rating WHERE archive_id = ?`);
  return (archive_id: number) => stmt.run(archive_id).changes > 0;
};

const deleteRatingsByUserId = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM archive_rating WHERE user_id = ?`);
  return (user_id: number) => stmt.run(user_id).changes > 0;
};

const deleteAllRatings = (db: Database) => {
  const stmt = db.prepare(`DELETE FROM archive_rating`);
  return () => stmt.run();
};

export const initRatingRepositories = (db: Database) => ({
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

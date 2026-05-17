const createUser = (db) => {
  const stmt = db.prepare(
    "INSERT INTO users (username, password, salt) VALUES (@username, @password, @salt)",
  );

  return ({ username, password, salt }) =>
    stmt.run({ username, password, salt });
};

const getAllUsers = (db) => {
  const stmt = db.prepare("SELECT * FROM users ORDER BY id");

  return () => stmt.all();
};

const getAllUsersSanitized = (db) => {
  const stmt = db.prepare("SELECT id, username FROM users ORDER BY id");

  return () => stmt.all();
};

const getUserByUsername = (db) => {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");

  return (username) => stmt.get(username);
};

const deleteUserById = (db) => {
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");

  return (id) => stmt.run(id);
};

const deleteUserByUsername = (db) => {
  const stmt = db.prepare("DELETE FROM users WHERE username = ?");

  return (username) => stmt.run(username);
};

exports.initUserQueries = (db) => ({
  createUser: createUser(db),
  deleteUserById: deleteUserById(db),
  deleteUserByUsername: deleteUserByUsername(db),
  getAllUsers: getAllUsers(db),
  getAllUsersSanitized: getAllUsersSanitized(db),
  getUserByUsername: getUserByUsername(db),
});

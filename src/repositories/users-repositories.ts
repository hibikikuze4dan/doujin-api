import { type Database } from "better-sqlite3";
import { User } from "../../types/database";

const createUser = (db: Database) => {
  const stmt = db.prepare(
    "INSERT INTO users (username, password, salt) VALUES (@username, @password, @salt)",
  );

  return ({
    username,
    password,
    salt,
  }: {
    username: string;
    password: string;
    salt: string;
  }) => stmt.run({ username, password, salt });
};

const getAllUsers = (db: Database) => {
  const stmt = db.prepare("SELECT * FROM users ORDER BY id");

  return () => stmt.all() as User[];
};

const getAllUsersSanitized = (db: Database) => {
  const stmt = db.prepare("SELECT id, username FROM users ORDER BY id");

  return () => stmt.all() as User[];
};

const getUserByUsername = (db: Database) => {
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");

  return (username: string) => stmt.get(username) as User | undefined;
};

const deleteUserById = (db: Database) => {
  const stmt = db.prepare("DELETE FROM users WHERE id = ?");

  return (id: number) => stmt.run(id);
};

const deleteUserByUsername = (db: Database) => {
  const stmt = db.prepare("DELETE FROM users WHERE username = ?");

  return (username: string) => stmt.run(username);
};

export const initUserQueries = (db: Database) => ({
  createUser: createUser(db),
  deleteUserById: deleteUserById(db),
  deleteUserByUsername: deleteUserByUsername(db),
  getAllUsers: getAllUsers(db),
  getAllUsersSanitized: getAllUsersSanitized(db),
  getUserByUsername: getUserByUsername(db),
});

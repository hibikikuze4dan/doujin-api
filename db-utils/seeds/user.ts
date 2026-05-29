import database from "../../db";
import { passwordUtils } from "../../utils";

export const seedUsers = () => {
  const admin = database.userQueries.getUserByUsername("admin");

  if (!admin) {
    const salt = passwordUtils.generateSalt();
    const password = passwordUtils.hashPassword("admin-password", salt);
    database.userQueries.createUser({ username: "admin", password, salt });
  }
};

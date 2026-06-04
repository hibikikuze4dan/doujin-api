import { userQueries } from "../../db";
import { passwordUtils } from "../../utils";

export const seedUsers = () => {
  const admin = userQueries.getUserByUsername("admin");

  if (!admin) {
    const salt = passwordUtils.generateSalt();
    const password = passwordUtils.hashPassword("admin-password", salt);
    userQueries.createUser({ username: "admin", password, salt });
  }
};

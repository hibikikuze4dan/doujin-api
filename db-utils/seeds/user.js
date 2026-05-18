const { userQueries } = require("../../db");
const { passwordUtils } = require("../../utils");

exports.seedUsers = () => {
  const admin = userQueries.getUserByUsername("admin");

  if (!admin) {
    const salt = passwordUtils.generateSalt();
    const password = passwordUtils.hashPassword("admin-password", salt);
    userQueries.createUser({ username: "admin", password, salt });
  }
};

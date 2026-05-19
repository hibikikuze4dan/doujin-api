const { userQueries } = require("../../db");
const { generateSalt, hashPassword } = require("../../utils/password");

exports.postUsersCreate = async ({ username, password } = {}) => {
  let data;
  let status = 200;

  if (username && password) {
    const isUserAlreadyCreated = !!userQueries.getUserByUsername(username);

    if (!isUserAlreadyCreated) {
      const salt = generateSalt();
      const saltedPassword = hashPassword(password, salt);

      const { changes, lastInsertRowid } =
        userQueries.createUser({
          username,
          password: saltedPassword,
          salt,
        }) ?? {};

      if (changes && lastInsertRowid) {
        const { created_at } = userQueries.getUserByUsername(username) ?? {};

        data = {
          id: lastInsertRowid,
          username,
          created_at,
        };
      }
    } else {
      status = 400;
      data = "Username has already been claimed";
    }
  } else {
    status = 400;
    data = "Please provide username and password for new user";
  }

  return {
    status,
    data,
  };
};

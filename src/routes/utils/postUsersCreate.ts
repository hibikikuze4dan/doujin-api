import { userQueries } from "../../../db";
import { generateSalt, hashPassword } from "../../../utils/password";

export const postUsersCreate = async (
  { username, password } = {} as { username: string; password: string },
) => {
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

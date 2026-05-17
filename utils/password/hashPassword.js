const crypto = require("crypto");

exports.hashPassword = (password, salt) => {
  return crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
};

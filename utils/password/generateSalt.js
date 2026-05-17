const crypto = require("crypto");

exports.generateSalt = (bytes = 16) => {
  return crypto.randomBytes(bytes).toString("hex");
};

const { generateSalt } = require("./generateSalt");
const { hashPassword } = require("./hashPassword");

module.exports = {
  generateSalt,
  hashPassword,
};

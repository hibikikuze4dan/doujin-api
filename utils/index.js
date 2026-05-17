const configuration = require("./configuration");
const archives = require("./archives");
const filesystem = require("./filesystem");
const password = require("./password");
const search = require("./search");
const startup = require("./startup");
const strings = require("./strings");
const tagging = require("./tagging");

module.exports = {
  ...configuration,
  ...archives,
  ...filesystem,
  passwordUtils: password,
  ...search,
  ...startup,
  ...strings,
  ...tagging,
};

const configuration = require("./configuration");
const database = require("./database");
const doujins = require("./doujins");
const filesystem = require("./filesystem");
const routes = require("./routes");
const startup = require("./startup");
const strings = require("./strings");
const tagging = require("./tagging");

module.exports = {
  ...configuration,
  ...database,
  ...doujins,
  ...filesystem,
  ...routes,
  ...startup,
  ...strings,
  ...tagging,
};

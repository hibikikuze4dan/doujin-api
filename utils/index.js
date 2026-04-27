const configuration = require("./configuration");
const doujins = require("./doujins");
const filesystem = require("./filesystem");
const routes = require("./routes");
const startup = require("./startup");
const tagging = require("./tagging");

module.exports = {
  ...configuration,
  ...doujins,
  ...filesystem,
  ...routes,
  ...startup,
  ...tagging,
};

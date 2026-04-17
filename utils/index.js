const configuration = require("./configuration");
const filesystem = require("./filesystem");
const routes = require("./routes");
const startup = require("./startup");
const tagging = require("./tagging");

module.exports = {
  ...configuration,
  ...filesystem,
  ...routes,
  ...startup,
  ...tagging,
};

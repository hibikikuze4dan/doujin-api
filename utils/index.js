const configuration = require("./configuration");
const filesystem = require("./filesystem");
const routes = require("./routes");
const startup = require("./startup");

module.exports = {
  ...configuration,
  ...filesystem,
  ...routes,
  ...startup,
};

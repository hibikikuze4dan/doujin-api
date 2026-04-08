const configuration = require("./configuration");
const filesystem = require("./filesystem");
const startup = require("./startup");

module.exports = {
  ...configuration,
  ...filesystem,
  ...startup,
};

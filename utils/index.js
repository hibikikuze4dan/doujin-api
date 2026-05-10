const configuration = require("./configuration");
const doujins = require("./doujins");
const filesystem = require("./filesystem");
const search = require("./search");
const startup = require("./startup");
const strings = require("./strings");
const tagging = require("./tagging");

module.exports = {
  ...configuration,
  ...doujins,
  ...filesystem,
  ...search,
  ...startup,
  ...strings,
  ...tagging,
};

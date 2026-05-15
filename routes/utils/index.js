const { deleteDoujinsId } = require("./deleteDoujinsId");
const { getDoujinsIdPages } = require("./getDoujinsIdPages");
const { getDoujinsIdThumbnail } = require("./getDoujinsIdThumbnail");
const { postCollectionsAdd } = require("./postCollectionsAdd");
const { postCollectionsIdAdd } = require("./postCollectionsIdAdd");
const { postArchivesAdd } = require("./postArchivesAdd");

module.exports = {
  deleteDoujinsId,
  getDoujinsIdPages,
  getDoujinsIdThumbnail,
  postCollectionsAdd,
  postCollectionsIdAdd,
  postArchivesAdd,
};

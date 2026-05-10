const { deleteDoujinsId } = require("./deleteDoujinsId");
const { getDoujinsIdPages } = require("./getDoujinsIdPages");
const { getDoujinsIdThumbnail } = require("./getDoujinsIdThumbnail");
const { postCollectionsAdd } = require("./postCollectionsAdd");
const { postCollectionsIdAdd } = require("./postCollectionsIdAdd");
const { postDoujinsAdd } = require("./postDoujinsAdd");

module.exports = {
  deleteDoujinsId,
  getDoujinsIdPages,
  getDoujinsIdThumbnail,
  postCollectionsAdd,
  postCollectionsIdAdd,
  postDoujinsAdd,
};

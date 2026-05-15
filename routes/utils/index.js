const { deleteArchivesId } = require("./deleteArchivesId");
const { getArchivesIdPages } = require("./getArchivesIdPages");
const { getArchivesIdThumbnail } = require("./getArchivesIdThumbnail");
const { postCollectionsAdd } = require("./postCollectionsAdd");
const { postCollectionsIdAdd } = require("./postCollectionsIdAdd");
const { postArchivesAdd } = require("./postArchivesAdd");

module.exports = {
  deleteArchivesId,
  getArchivesIdPages,
  getArchivesIdThumbnail,
  postCollectionsAdd,
  postCollectionsIdAdd,
  postArchivesAdd,
};

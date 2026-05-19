const { deleteArchivesId } = require("./deleteArchivesId");
const { getArchivesIdPages } = require("./getArchivesIdPages");
const { getArchivesIdThumbnail } = require("./getArchivesIdThumbnail");
const { postCollectionsAdd } = require("./postCollectionsAdd");
const { postCollectionsIdAdd } = require("./postCollectionsIdAdd");
const { postArchivesAdd } = require("./postArchivesAdd");
const { getPublicImage } = require("./getPublicImage");
const { putArchivesRating } = require("./putArchivesRating");
const { postUsersCreate } = require("./postUsersCreate");

module.exports = {
  deleteArchivesId,
  getArchivesIdPages,
  getArchivesIdThumbnail,
  getPublicImage,
  postCollectionsAdd,
  postCollectionsIdAdd,
  postArchivesAdd,
  putArchivesRating,
  postUsersCreate,
};

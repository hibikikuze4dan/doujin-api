const {
  createTagsDatabaseInsertObject,
} = require("./createTagsDatabaseInsertObject");

exports.createTagsDatabaseInsertArray = (archiveId, tagsString = "") => {
  if (!archiveId || !tagsString) {
    return [];
  }

  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => createTagsDatabaseInsertObject(archiveId, tag));
};

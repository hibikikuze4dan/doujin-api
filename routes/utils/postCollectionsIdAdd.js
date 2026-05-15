const { collectionsQueries } = require("../../db");
const { getCollectionWithArchives } = require("../../db-utils");

exports.postCollectionsIdAdd = async ({ collectionId, archiveId } = {}) => {
  if (!collectionId || !archiveId) {
    return null;
  }

  try {
    const { changes = 0, lastInsertRowid = 0 } =
      collectionsQueries?.addArchiveToCollection?.(collectionId, archiveId) ??
      {};

    if (changes && lastInsertRowid) {
      const collectionData = await getCollectionWithArchives(collectionId);
      return collectionData;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

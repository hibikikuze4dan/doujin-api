exports.postCollectionsIdAdd = async ({ collectionId, archiveId } = {}) => {
  if (!collectionId || !archiveId) {
    return null;
  }

  try {
    const { changes = 0, lastInsertRowid = 0 } =
      collectionsQueries?.addDoujinToCollection(collectionId, archiveId);

    if (changes && lastInsertRowid) {
      const collection = collectionsQueries?.getCollectionById(collectionId);
      const archives = collectionsQueries?.getDoujinsInCollection(collectionId);

      return {
        ...collection,
        archives: archives,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

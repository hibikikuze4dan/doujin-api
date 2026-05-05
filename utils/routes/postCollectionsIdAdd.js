exports.postCollectionsIdAdd = async ({ collectionId, arcId } = {}) => {
  if (!collectionId || !arcId) {
    return null;
  }

  try {
    const { changes = 0, lastInsertRowid = 0 } =
      collectionsQueries?.addDoujinToCollection(collectionId, arcId);

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

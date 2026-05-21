const { collectionsQueries } = require("../db");

exports.getCollectionWithArchives = async (collectionId) => {
  if (!collectionId) {
    return null;
  }

  try {
    const collection = collectionsQueries?.getCollectionById(collectionId);
    const archives = collectionsQueries?.getArchivesInCollection(collectionId);

    return {
      ...collection,
      archives: archives,
    };
  } catch (err) {
    console.error(
      `Something went wrong while trying to get the data of collection ${collectionId}:\n${err}`,
    );
    return null;
  }
};

const { collectionsQueries } = require("../../db");
const { getArchiveWithTags } = require("./getArchiveWithTags");

exports.getCollectionWithArchives = async (collectionId) => {
  if (!collectionId) {
    return null;
  }

  try {
    const collection = collectionsQueries?.getCollectionById(collectionId);
    const archives = collectionsQueries
      ?.getDoujinsInCollection(collectionId)
      ?.map((arc) => getArchiveWithTags(arc?.id));

    return {
      ...collection,
      archives: archives,
    };
  } catch (err) {
    console.error(
      `Something went wrong while trying to get the data of collection ${collection}:\n${err}`,
    );
    return null;
  }
};

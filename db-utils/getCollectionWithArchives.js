const { collectionsQueries } = require("../db");
const { getArchiveWithTableData } = require("./getArchiveWithTableData");

exports.getCollectionWithArchives = async (collectionId) => {
  if (!collectionId) {
    return null;
  }

  try {
    const collection = collectionsQueries?.getCollectionById(collectionId);
    const archives = collectionsQueries
      ?.getArchivesInCollection(collectionId)
      ?.map((arc) => getArchiveWithTableData(arc?.id));

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

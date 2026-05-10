const { collectionsQueries } = require("../../db");
const { getCollectionWithArchives } = require("../../db-utils");

exports.postCollectionsAdd = async ({ name, description } = {}) => {
  if (!name) {
    return null;
  }

  try {
    const { changes = 0, lastInsertRowid } =
      collectionsQueries?.createCollection(name, description ?? "");

    const collection = await getCollectionWithArchives(lastInsertRowid);

    if (changes && lastInsertRowid && collection) {
      return {
        status: "success",
        message: `Created new collection: ${name}`,
        data: collection,
      };
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

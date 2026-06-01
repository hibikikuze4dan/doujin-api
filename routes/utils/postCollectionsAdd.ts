import { collectionsQueries } from "../../db";
import { getCollectionWithArchives } from "../../db-utils";

export const postCollectionsAdd = async (
  { name, description } = {} as { name?: string; description?: string },
) => {
  if (!name) {
    return null;
  }

  try {
    const { changes = 0, lastInsertRowid } =
      collectionsQueries?.createCollection?.(name, description ?? "") ?? {};

    if (!lastInsertRowid) {
      return null;
    }

    const collection = await getCollectionWithArchives(
      lastInsertRowid as number,
    );

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

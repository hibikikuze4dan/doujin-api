import { collectionsQueries } from "../../../db";
import { getCollectionWithArchives } from "../../../db-utils";

export const postCollectionsIdAdd = async (
  { collectionId, archiveId } = {} as {
    collectionId: number;
    archiveId: number;
  },
) => {
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

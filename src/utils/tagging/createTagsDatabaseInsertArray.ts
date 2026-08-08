import { createTagsDatabaseInsertObject } from "./createTagsDatabaseInsertObject";

export const createTagsDatabaseInsertArray = (
  archiveId: string | number,
  tagsString = "",
) => {
  if (!archiveId || !tagsString) {
    return [];
  }

  const tagsArray = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .map((tag) => createTagsDatabaseInsertObject(archiveId, tag))
    .filter((tag) => !!tag);

  return tagsArray;
};

import { createTagsDatabaseInsertObject } from "./createTagsDatabaseInsertObject";

export const createTagsDatabaseInsertArray = (
  archiveId: string,
  tagsString = "",
) => {
  if (!archiveId || !tagsString) {
    return [];
  }

  const tagsArray = tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => createTagsDatabaseInsertObject(archiveId, tag));

  return tagsArray;
};

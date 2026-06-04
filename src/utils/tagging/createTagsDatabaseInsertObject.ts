import { parseNumericQuery } from "../query";

export const createTagsDatabaseInsertObject = (
  archiveId?: string | number,
  tag = "",
) => {
  if (!archiveId || !tag) {
    return null;
  }

  const colonIndex = tag.indexOf(":");

  const numericArchiveId = parseNumericQuery(archiveId);

  if (!numericArchiveId) {
    return null;
  }

  if (colonIndex === -1) {
    return { archive_id: numericArchiveId, name: tag, namespace: "" };
  }

  const namespace = tag.slice(0, colonIndex).trim();
  const name = tag.slice(colonIndex + 1).trim();

  return { archive_id: numericArchiveId, name, namespace };
};

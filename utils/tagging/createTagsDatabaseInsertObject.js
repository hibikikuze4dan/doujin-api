exports.createTagsDatabaseInsertObject = (archiveId, tag = "") => {
  if (!archiveId || !tag) {
    return null;
  }

  const colonIndex = tag.indexOf(":");

  if (colonIndex === -1) {
    return { archive_id: archiveId, name: tag, namespace: "" };
  }

  const namespace = tag.slice(0, colonIndex).trim();
  const name = tag.slice(colonIndex + 1).trim();

  return { archive_id: archiveId, name, namespace };
};

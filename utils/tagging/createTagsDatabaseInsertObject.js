exports.createTagsDatabaseInsertObject = (archiveId, tag = "") => {
  if (!archiveId || !tag) {
    return null;
  }

  const colonIndex = tag.indexOf(":");

  if (colonIndex === -1) {
    return { doujin_id: archiveId, name: tag, namespace: "" };
  }

  const namespace = tag.slice(0, colonIndex).trim();
  const name = tag.slice(colonIndex + 1).trim();

  return { doujin_id: archiveId, name, namespace };
};

const parseTagsString = (doujin_id, tagsString) => {
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
    .map((tag) => {
      const colonIndex = tag.indexOf(":");

      if (colonIndex === -1) {
        return { doujin_id, name: tag, namespace: "" };
      }

      const namespace = tag.slice(0, colonIndex).trim();
      const name = tag.slice(colonIndex + 1).trim();

      return { doujin_id, name, namespace };
    });
};

const { doujinsQueries, tagsQueries } = require("../db");

exports.getArchiveWithTags = (archiveId) => {
  const archive = doujinsQueries.getArchiveById(archiveId);
  const tagsArray = tagsQueries.getTagsByDoujinId(archiveId) ?? [];

  const tagsString = tagsArray
    .map(({ name, namespace }) => (namespace ? `${namespace}:${name}` : name))
    .join(", ");

  return {
    ...archive,
    tags: tagsString,
  };
};

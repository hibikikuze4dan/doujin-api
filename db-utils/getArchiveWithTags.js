const { archivesQueries, tagsQueries } = require("../db");

exports.getArchiveWithTags = (archiveId) => {
  const archive = archivesQueries.getArchiveById(archiveId);
  const tagsArray = tagsQueries.getTagsByArchiveId(archiveId) ?? [];

  const tagsString = tagsArray
    .map(({ name, namespace }) => (namespace ? `${namespace}:${name}` : name))
    .join(", ");

  return {
    ...archive,
    tags: tagsString,
  };
};

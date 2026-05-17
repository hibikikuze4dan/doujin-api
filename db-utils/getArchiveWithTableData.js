const { archivesQueries, tagsQueries, ratingQueries } = require("../db");

exports.getArchiveWithTableData = (archiveId) => {
  const archive = archivesQueries.getArchiveById(archiveId);
  const tagsArray = tagsQueries.getTagsByArchiveId(archiveId) ?? [];
  const archiveRatings = ratingQueries.getRatingsByArchiveId(archiveId);
  const totalArchives = archiveRatings?.length || 1;

  const tagsString = tagsArray
    .map(({ name, namespace }) => (namespace ? `${namespace}:${name}` : name))
    .join(", ");

  const sumOfAllRatings =
    archiveRatings?.reduce?.((accumulator, archiveRating) => {
      return accumulator + (archiveRating?.rating ?? 0);
    }, 0) ?? 0;

  const rating = sumOfAllRatings / totalArchives;

  return {
    ...archive,
    rating,
    tags: tagsString,
  };
};

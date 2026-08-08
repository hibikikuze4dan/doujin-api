import {
  archivesQueries,
  archiveTagQueries,
  ratingQueries,
  tagCategoryQueries,
  tagsQueries,
} from "../db";

export const getArchiveWithTableData = (archiveId: number) => {
  const archive = archivesQueries.getArchiveById(archiveId);
  const tagCategories = tagCategoryQueries.getAllTagCategoryRows();
  const archiveRatings = ratingQueries.getRatingsByArchiveId(archiveId);
  const totalArchives = archiveRatings?.length || 1;
  const archiveTags = archiveTagQueries.getArchiveTags("archive_id", archiveId);
  const tagsArray = archiveTags.map((archiveTag) => {
    const tag = tagsQueries.getTag("id", archiveTag.tag_id);
    const categoryId = tag?.category_id;
    const tagCategory = categoryId
      ? tagCategories?.find((cat) => cat.id === categoryId)?.name
      : null;
    return { name: tag?.name, namespace: tagCategory };
  });

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

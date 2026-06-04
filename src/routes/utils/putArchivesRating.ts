import { archivesQueries, ratingQueries } from "../../../db";

export const putArchivesRating = async (
  { archive_id, user_id, rating } = {} as {
    archive_id: number;
    user_id: number;
    rating: number;
  },
) => {
  let status = 200;
  let data, createRatingResults;

  const ratingEntry = ratingQueries.getRatingByArchiveAndUser({
    archive_id,
    user_id,
  });

  if (!ratingEntry) {
    createRatingResults = ratingQueries.createRating({
      archive_id,
      user_id,
      rating,
    });
  }

  if (0 < (createRatingResults?.changes ?? 0)) {
    const archive = archivesQueries.getArchiveById(archive_id);

    data = {
      status: "success",
      message: `Applied rating of ${rating} to ${archive?.name}`,
      data: archive,
    };
  } else {
    status = 400;
    data = {
      status: "failure",
      message: "Something went wrong!",
    };
  }

  return { status, data };
};

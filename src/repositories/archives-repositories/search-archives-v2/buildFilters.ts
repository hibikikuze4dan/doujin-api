import { toFtsQuery } from "../../../utils";
import { type BuildFiltersParams } from "../types";

// Shared by both search and count so filter logic can't drift out of sync.
export const buildFilters = ({
  query,
  minRating,
  maxRating,
  minPagecount,
  maxPagecount,
  minSize,
  maxSize,
  dateAddedFrom,
  dateAddedTo,
  dateCreatedFrom,
  dateCreatedTo,
}: BuildFiltersParams) => {
  const conditions = [];
  const params = [];

  const badValues: (null | undefined | string)[] = [null, undefined];

  if (!badValues.includes(minRating)) {
    conditions.push("a.rating >= ?");
    params.push(minRating);
  }
  if (!badValues.includes(maxRating)) {
    conditions.push("a.rating <= ?");
    params.push(maxRating);
  }
  if (!badValues.includes(minPagecount)) {
    conditions.push("a.pagecount >= ?");
    params.push(minPagecount);
  }
  if (!badValues.includes(maxPagecount)) {
    conditions.push("a.pagecount <= ?");
    params.push(maxPagecount);
  }
  if (!badValues.includes(minSize)) {
    conditions.push("a.size >= ?");
    params.push(minSize);
  }
  if (!badValues.includes(maxSize)) {
    conditions.push("a.size <= ?");
    params.push(maxSize);
  }
  if (dateAddedFrom) {
    conditions.push("a.date_added >= ?");
    params.push(dateAddedFrom);
  }
  if (dateAddedTo) {
    conditions.push("a.date_added <= ?");
    params.push(dateAddedTo);
  }
  if (dateCreatedFrom) {
    conditions.push("a.date_created >= ?");
    params.push(dateCreatedFrom);
  }
  if (dateCreatedTo) {
    conditions.push("a.date_created <= ?");
    params.push(dateCreatedTo);
  }

  const hasQuery = query && query.trim().length > 0;
  if (hasQuery) conditions.unshift("archive_fts MATCH ?");

  return {
    hasQuery,
    conditions,
    params: hasQuery ? [toFtsQuery(query), ...params] : params,
  };
};

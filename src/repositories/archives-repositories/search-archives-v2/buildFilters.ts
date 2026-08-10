import { toFtsQuery } from "../../../utils";
import { type BuildFiltersParams } from "../types";

// Shared by both search and count so filter logic can't drift out of sync.
export const buildFilters = ({
  query,
  min_rating,
  max_rating,
  min_pages,
  max_pages,
  min_size,
  max_size,
  dateAddedFrom,
  dateAddedTo,
  dateCreatedFrom,
  dateCreatedTo,
}: BuildFiltersParams) => {
  const conditions = [];
  const params = [];

  const badValues: (null | undefined | string)[] = [null, undefined];

  if (!badValues.includes(min_rating)) {
    conditions.push("a.rating >= ?");
    params.push(min_rating);
  }
  if (!badValues.includes(max_rating)) {
    conditions.push("a.rating <= ?");
    params.push(max_rating);
  }
  if (!badValues.includes(min_pages)) {
    conditions.push("a.pagecount >= ?");
    params.push(min_pages);
  }
  if (!badValues.includes(max_pages)) {
    conditions.push("a.pagecount <= ?");
    params.push(max_pages);
  }
  if (!badValues.includes(min_size)) {
    conditions.push("a.size >= ?");
    params.push(min_size);
  }
  if (!badValues.includes(max_size)) {
    conditions.push("a.size <= ?");
    params.push(max_size);
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

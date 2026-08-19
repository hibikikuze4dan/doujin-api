import { QueryParameter } from "../../../types/general";
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
  max_tags,
  min_tags,
  created_after,
  created_before,
  added_after,
  added_before,
}: BuildFiltersParams) => {
  const conditions = [];
  const params = [];

  const badValues: QueryParameter[] = [null, undefined];

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
  if (!badValues.includes(min_tags)) {
    conditions.push("a.tag_count >= ?");
    params.push(min_tags);
  }
  if (!badValues.includes(max_tags)) {
    conditions.push("a.tag_count <= ?");
    params.push(max_tags);
  }
  if (added_after) {
    conditions.push("a.date_added >= ?");
    params.push(added_after);
  }
  if (added_before) {
    conditions.push("a.date_added <= ?");
    params.push(added_before);
  }
  if (created_after) {
    conditions.push("a.date_created >= ?");
    params.push(created_after);
  }
  if (created_before) {
    conditions.push("a.date_created <= ?");
    params.push(created_before);
  }

  const isString = typeof query === "string";
  const validateStrignQuery = isString ? query.trim().length > 0 : true;

  const hasQuery = query && validateStrignQuery;
  if (hasQuery) conditions.unshift("archive_fts MATCH ?");

  return {
    hasQuery,
    conditions,
    params: hasQuery && isString ? [toFtsQuery(query), ...params] : params,
  };
};

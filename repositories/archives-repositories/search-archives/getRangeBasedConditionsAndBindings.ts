import {
  type DatabaseQueryBindings,
  type DatabaseQueryConditions,
} from "../types";

type GetRangeBasedConditionsAndBindingsParams = {
  bindings: DatabaseQueryBindings;
  conditions: DatabaseQueryConditions;
  min_pages?: number;
  max_pages?: number;
  min_size?: number;
  max_size?: number;
  min_rating?: number;
  max_rating?: number;
  min_tags?: number;
  max_tags?: number;
};

export const getRangeBasedConditionsAndBindings = (
  {
    bindings = [],
    conditions = [],
    min_pages,
    max_pages,
    min_size,
    max_size,
    min_rating,
    max_rating,
    min_tags,
    max_tags,
  } = {} as GetRangeBasedConditionsAndBindingsParams,
) => {
  // --- Scalar range filters ---
  if (min_pages !== undefined && !Number.isNaN(min_pages)) {
    conditions.push("d.pagecount >= ?");
    bindings.push(min_pages);
  }
  if (max_pages !== undefined && !Number.isNaN(max_pages)) {
    conditions.push("d.pagecount <= ?");
    bindings.push(max_pages);
  }
  if (min_size !== undefined && !Number.isNaN(min_size)) {
    conditions.push("d.size >= ?");
    bindings.push(min_size);
  }
  if (max_size !== undefined && !Number.isNaN(max_size)) {
    conditions.push("d.size <= ?");
    bindings.push(max_size);
  }
  if (min_rating !== undefined && !Number.isNaN(min_rating)) {
    conditions.push("COALESCE(ar.avg_rating, 0) >= ?");
    bindings.push(min_rating);
  }
  if (max_rating !== undefined && !Number.isNaN(max_rating)) {
    conditions.push("COALESCE(ar.avg_rating, 0) <= ?");
    bindings.push(max_rating);
  }
  if (min_tags !== undefined && !Number.isNaN(min_tags)) {
    conditions.push("COALESCE(tc.tag_count, 0) >= ?");
    bindings.push(min_tags);
  }
  if (max_tags !== undefined && !Number.isNaN(max_tags)) {
    conditions.push("COALESCE(tc.tag_count, 0) <= ?");
    bindings.push(max_tags);
  }

  return { conditions, bindings };
};

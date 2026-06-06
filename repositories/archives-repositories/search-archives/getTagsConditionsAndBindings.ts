import { parseTag, splitByComma } from "../../../src/utils";
import {
  type DatabaseQueryBindings,
  type DatabaseQueryConditions,
} from "../types";

export const getTagsConditionsAndBindings = ({
  bindings = [] as DatabaseQueryBindings,
  conditions = [] as DatabaseQueryConditions,
  tags = "",
  tag_mode = "and",
} = {}) => {
  const splitTags = splitByComma(tags).map(parseTag);

  if (splitTags.length > 0) {
    if (tag_mode === "or") {
      // At least one tag must match — a single EXISTS with OR inside
      const tagClauses = splitTags.map(({ namespace, name }) => {
        if (namespace) {
          bindings.push(namespace, name);
          return `(t2.namespace = ? AND t2.name = ? COLLATE NOCASE)`;
        } else {
          bindings.push(name);
          return `t2.name = ? COLLATE NOCASE`;
        }
      });

      conditions.push(`
        EXISTS (
          SELECT 1 FROM tags t2
          WHERE t2.archive_id = d.id
          AND (${tagClauses.join(" OR ")})
        )
      `);
    } else {
      // AND mode — one EXISTS per tag, all must be satisfied
      for (const { namespace, name } of splitTags) {
        if (namespace) {
          bindings.push(namespace, name);
          conditions.push(`
            EXISTS (
              SELECT 1 FROM tags t2
              WHERE t2.archive_id = d.id
              AND t2.namespace = ? COLLATE NOCASE
              AND t2.name = ? COLLATE NOCASE
            )
          `);
        } else {
          bindings.push(name);
          conditions.push(`
            EXISTS (
              SELECT 1 FROM tags t2
              WHERE t2.archive_id = d.id
              AND t2.name = ? COLLATE NOCASE
            )
          `);
        }
      }
    }
  }

  return {
    conditions,
    bindings,
  };
};

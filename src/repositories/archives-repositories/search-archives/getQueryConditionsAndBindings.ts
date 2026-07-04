import { splitByComma } from "../../../utils";
import {
  type DatabaseQueryBindings,
  type DatabaseQueryConditions,
} from "../types";

export const getQueryConditionsAndBindings = ({
  bindings = [] as DatabaseQueryBindings,
  conditions = [] as DatabaseQueryConditions,
  q_mode = "and",
  q = "",
} = {}) => {
  const terms = splitByComma(q)
    .map((term) => term.trim())
    .filter(Boolean);

  if (terms.length > 0) {
    const termClauses = terms.map((term) => {
      bindings.push(term, term);

      return `(
        EXISTS (
          SELECT 1
          FROM archives_fts af
          WHERE af.rowid = d.id
          AND af.name MATCH ?
        )
        OR EXISTS (
          SELECT 1
          FROM tags t2
          JOIN tags_fts tf ON tf.rowid = t2.id
          WHERE t2.archive_id = d.id
          AND tf.tag_text MATCH ?
        )
      )`;
    });

    const joinWord = q_mode === "or" ? " OR " : " AND ";
    conditions.push(`(${termClauses.join(joinWord)})`);
  }

  return { conditions, bindings };
};

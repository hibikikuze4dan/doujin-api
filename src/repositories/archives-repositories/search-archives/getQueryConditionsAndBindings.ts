import { splitByComma } from "../../../utils";
import {
  type DatabaseQueryBindings,
  type DatabaseQueryConditions,
} from "../types";

export const getQueryConditionsAndBindings = ({
  bindings = [] as DatabaseQueryBindings,
  conditions = [] as DatabaseQueryConditions,
  q_mode = "and",
  q_match_mode = "prefix",
  q = "",
} = {}) => {
  const commaTerms = splitByComma(q).map((term) => term.trim()).filter(Boolean);

  if (commaTerms.length > 0) {
    const queryValue = q_match_mode === "phrase"
      ? commaTerms
          .map((term) => `"${term.replace(/"/g, '""')}"`)
          .join(q_mode === "or" ? " OR " : " ")
      : commaTerms
          .flatMap((term) => term.split(/\s+/))
          .map((term) => term.trim().toLowerCase())
          .filter(Boolean)
          .filter((term, index, array) => array.indexOf(term) === index)
          .filter((term) => term.length > 1)
          .map((term) => `${term}*`)
          .join(q_mode === "or" ? " OR " : " ");

    if (queryValue) {
      bindings.push(queryValue);

      conditions.push(`
        EXISTS (
          SELECT 1
          FROM archives_tags_fts
          WHERE rowid = d.id
          AND archives_tags_fts MATCH ?
        )
      `);
    }
  }

  return { conditions, bindings };
};

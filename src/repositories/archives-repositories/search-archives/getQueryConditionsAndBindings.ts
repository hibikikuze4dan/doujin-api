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
    const joinWord = q_mode === "or" ? " OR " : " ";
    const queryValue = terms.join(joinWord);

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

  return { conditions, bindings };
};

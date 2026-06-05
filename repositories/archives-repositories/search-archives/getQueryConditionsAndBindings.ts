import { splitByComma } from "../../../src/utils";
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
  const terms = splitByComma(q);

  if (terms.length > 0) {
    const termClauses = terms.map(() => {
      // We'll add three bindings per term below: one for d.name, one for tag name, one for namespace:name
      bindings.push(...Array(3).fill(null));
      return `(
        d.name LIKE '%' || ? || '%' COLLATE NOCASE OR
        EXISTS (
          SELECT 1 FROM tags t2
          WHERE t2.archive_id = d.id
          AND (
            t2.name LIKE '%' || ? || '%' COLLATE NOCASE OR
            (t2.namespace || ':' || t2.name) LIKE '%' || ? || '%' COLLATE NOCASE
          )
        )
      )`;
    });

    // Replace placeholder nulls with actual repeated term values
    let bindingIndex = bindings.indexOf(null);
    for (const term of terms) {
      bindings[bindingIndex] = term; // for d.name
      bindings[bindingIndex + 1] = term; // for t2.name
      bindings[bindingIndex + 2] = term; // for t2.namespace:name
      bindingIndex += 3;
    }

    const joinWord = q_mode === "or" ? " OR " : " AND ";
    conditions.push(`(${termClauses.join(joinWord)})`);
  }

  return { conditions, bindings };
};

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
  useTokenIndex = false,
} = {}) => {
  const commaTerms = splitByComma(q)
    .map((term) => term.trim())
    .filter(Boolean);

  if (commaTerms.length > 0) {
    const normalizedTerms = commaTerms
      .flatMap((term) => term.split(/\s+/))
      .map((term) => term.trim().toLowerCase())
      .filter(Boolean)
      .filter((term, index, array) => array.indexOf(term) === index)
      .filter((term) => term.length > 1);

    if (
      useTokenIndex &&
      q_match_mode !== "phrase" &&
      normalizedTerms.length >= 3
    ) {
      const tokenConditions = normalizedTerms.map(
        () => `
        EXISTS (
          SELECT 1
          FROM archive_search_tokens ast
          WHERE ast.archive_id = d.id
          AND ast.token LIKE ?
        )
      `,
      );

      if (q_mode === "or") {
        conditions.push(`(${tokenConditions.join(" OR ")})`);
      } else {
        conditions.push(...tokenConditions);
      }

      bindings.push(...normalizedTerms.map((term) => `${term}%`));
      return { conditions, bindings };
    }

    const queryValue =
      q_match_mode === "phrase"
        ? commaTerms
            .map((term) => `"${term.replace(/"/g, '""')}"`)
            .join(q_mode === "or" ? " OR " : " ")
        : normalizedTerms
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

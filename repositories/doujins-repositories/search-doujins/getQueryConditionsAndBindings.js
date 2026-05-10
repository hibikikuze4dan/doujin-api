const { splitByComma } = require("../../../utils");

exports.getQueryConditionsAndBindings = ({
  bindings = [],
  conditions = [],
  q_mode = "and",
  q = "",
} = {}) => {
  const terms = splitByComma(q);

  if (terms.length > 0) {
    const termClauses = terms.map(() => {
      bindings.push(...Array(3).fill(null)); // placeholder, filled below
      return `(
        d.name     LIKE '%' || ? || '%' COLLATE NOCASE OR
        t.name     LIKE '%' || ? || '%' COLLATE NOCASE OR
        (t.namespace || ':' || t.name) LIKE '%' || ? || '%' COLLATE NOCASE
      )`;
    });

    // Replace placeholder nulls with actual repeated term values
    let bindingIndex = bindings.indexOf(null);
    for (const term of terms) {
      bindings[bindingIndex] = term;
      bindings[bindingIndex + 1] = term;
      bindings[bindingIndex + 2] = term;
      bindingIndex += 3;
    }

    const joinWord = q_mode === "or" ? " OR " : " AND ";
    conditions.push(`(${termClauses.join(joinWord)})`);
  }

  return { conditions, bindings };
};

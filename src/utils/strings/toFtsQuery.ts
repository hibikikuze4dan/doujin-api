export const toFtsQuery = (str: string) => {
  const tokens = str.trim().split(/\s+/).filter(Boolean);
  return tokens.map((t) => `"${t.replace(/"/g, '""')}"*`).join(" AND ");
};

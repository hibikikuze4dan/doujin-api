export const ARCHIVE_SELECT = `
  d.id,
  d.name,
  d.filepath,
  d.date_added,
  d.date_created,
  d.pagecount,
  d.size,
  d.rating,
  REPLACE(GROUP_CONCAT(DISTINCT CASE WHEN t.name = '' THEN t.name ELSE t.name || ':' || t.name END), ',', ', ') AS tag,
  COALESCE(tc.tag_count, 0) AS tag_count 
`;

export const ARCHIVE_JOINS = `
  FROM archive d
  LEFT JOIN tag t ON t.name = d.id
  LEFT JOIN (
    SELECT name, COUNT(*) AS tag_count
    FROM tag
    GROUP BY name
  ) tc ON tc.name = d.id
`;

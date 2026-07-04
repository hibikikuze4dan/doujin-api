export const ARCHIVE_SELECT = `
  d.id,
  d.name,
  d.filepath,
  d.date_added,
  d.date_created,
  d.pagecount,
  d.size,
  d.rating,
  REPLACE(GROUP_CONCAT(DISTINCT CASE WHEN t.namespace = '' THEN t.name ELSE t.namespace || ':' || t.name END), ',', ', ') AS tags,
  COALESCE(tc.tag_count, 0) AS tag_count 
`;

export const ARCHIVE_JOINS = `
  FROM archives d
  LEFT JOIN tags t ON t.archive_id = d.id
  LEFT JOIN (
    SELECT archive_id, COUNT(*) AS tag_count
    FROM tags
    GROUP BY archive_id
  ) tc ON tc.archive_id = d.id
`;

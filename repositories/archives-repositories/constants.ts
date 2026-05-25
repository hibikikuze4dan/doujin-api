export const ARCHIVE_SELECT = `
  d.id,
  d.name,
  d.filepath,
  d.date_added,
  d.date_created,
  d.pagecount,
  d.size,
  COALESCE(ar.avg_rating, 0) AS rating,
  REPLACE(GROUP_CONCAT(DISTINCT CASE WHEN t.namespace = '' THEN t.name ELSE t.namespace || ':' || t.name END), ',', ', ') AS tags
`;

export const ARCHIVE_JOINS = `
  FROM archives d
  LEFT JOIN tags t ON t.archive_id = d.id
  LEFT JOIN (
    SELECT archive_id, AVG(rating) AS avg_rating
    FROM archive_rating
    GROUP BY archive_id
  ) ar ON ar.archive_id = d.id
`;

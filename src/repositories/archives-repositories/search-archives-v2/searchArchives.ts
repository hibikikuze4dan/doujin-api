import { SearchArchivesParams } from "../types";
import { buildFilters } from "./buildFilters";

export const searchArchives = ({
  allowedSortColumns,
  db,
  sort_by = "date_added",
  sort_dir = "DESC",
  resultsPage = 1,
  archivesPerPage = 50,
  ...filters
}: SearchArchivesParams) => {
  if (!allowedSortColumns?.has(sort_by)) {
    sort_by = "date_added";
  }

  sort_dir = `${sort_dir}`.toUpperCase() === "ASC" ? "ASC" : "DESC";
  resultsPage = Math.max(1, resultsPage | 0);
  archivesPerPage = Math.max(1, archivesPerPage | 0);
  const offset = (resultsPage - 1) * archivesPerPage;

  const { hasQuery, conditions, params } = buildFilters(filters);

  let innerSql, innerParams, outerOrderBy;

  if (hasQuery) {
    innerSql = `
        SELECT a.id AS id, f.rank AS ord_rank,
               a.${sort_by} AS ord_tiebreak, a.name AS ord_name
        FROM archive_fts f
        JOIN archive a ON a.id = f.rowid
        WHERE ${conditions.join(" AND ")}
        ORDER BY f.rank ASC, a.${sort_by} ${sort_dir}, a.name ${sort_dir}, a.id ${sort_dir}
        LIMIT ? OFFSET ?
      `;
    outerOrderBy = `page.ord_rank ASC, page.ord_tiebreak ${sort_dir}, page.ord_name ${sort_dir}, page.id ${sort_dir}`;
  } else {
    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    innerSql = `
        SELECT a.id AS id, a.${sort_by} AS ord_tiebreak, a.name AS ord_name
        FROM archive a
        ${whereClause}
        ORDER BY a.${sort_by} ${sort_dir}, a.name ${sort_dir}, a.id ${sort_dir}
        LIMIT ? OFFSET ?
      `;
    outerOrderBy = `page.ord_tiebreak ${sort_dir}, page.ord_name ${sort_dir}, page.id ${sort_dir}`;
  }

  innerParams = [...params, archivesPerPage, offset];

  const sql = `
      SELECT a.*
      FROM (${innerSql}) AS page
      JOIN archive a ON a.id = page.id
      ORDER BY ${outerOrderBy}
    `;

  const results = db?.prepare(sql).all(...innerParams);

  return results;
};

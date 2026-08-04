import { SearchArchivesParams } from "../types";
import { buildFilters } from "./buildFilters";

export const searchArchives = ({
  allowedSortColumns,
  db,
  sortBy = "date_added",
  sortDir = "DESC",
  resultsPage = 1,
  archivesPerPage = 50,
  ...filters
}: SearchArchivesParams) => {
  if (!allowedSortColumns.has(sortBy)) sortBy = "date_added";
  sortDir = sortDir.toUpperCase() === "ASC" ? "ASC" : "DESC";
  resultsPage = Math.max(1, resultsPage | 0);
  archivesPerPage = Math.max(1, archivesPerPage | 0);
  const offset = (resultsPage - 1) * archivesPerPage;

  const { hasQuery, conditions, params } = buildFilters(filters);

  let innerSql, innerParams, outerOrderBy;

  if (hasQuery) {
    innerSql = `
        SELECT a.id AS id, f.rank AS ord_rank,
               a.${sortBy} AS ord_tiebreak, a.name AS ord_name
        FROM archive_fts f
        JOIN archive a ON a.id = f.rowid
        WHERE ${conditions.join(" AND ")}
        ORDER BY f.rank ASC, a.${sortBy} ${sortDir}, a.name ${sortDir}, a.id ${sortDir}
        LIMIT ? OFFSET ?
      `;
    outerOrderBy = `page.ord_rank ASC, page.ord_tiebreak ${sortDir}, page.ord_name ${sortDir}, page.id ${sortDir}`;
  } else {
    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    innerSql = `
        SELECT a.id AS id, a.${sortBy} AS ord_tiebreak, a.name AS ord_name
        FROM archive a
        ${whereClause}
        ORDER BY a.${sortBy} ${sortDir}, a.name ${sortDir}, a.id ${sortDir}
        LIMIT ? OFFSET ?
      `;
    outerOrderBy = `page.ord_tiebreak ${sortDir}, page.ord_name ${sortDir}, page.id ${sortDir}`;
  }

  innerParams = [...params, archivesPerPage, offset];

  const sql = `
      SELECT a.*
      FROM (${innerSql}) AS page
      JOIN archive a ON a.id = page.id
      ORDER BY ${outerOrderBy}
    `;

  return db.prepare(sql).all(...innerParams);
};

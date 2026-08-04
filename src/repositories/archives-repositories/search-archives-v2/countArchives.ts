import { type Database } from "better-sqlite3";
import { type BuildFiltersParams } from "../types";
import { buildFilters } from "./buildFilters";

export const countArchives = ({
  db,
  ...functionParams
}: BuildFiltersParams & { db: Database }) => {
  const { hasQuery, conditions, params } = buildFilters(functionParams);

  const fromClause = hasQuery
    ? `FROM archive_fts f JOIN archive a ON a.id = f.rowid`
    : `FROM archive a`;
  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const stmt = `SELECT COUNT(*) AS total ${fromClause} ${whereClause}`;
  const { total } = db.prepare(stmt).get(...params) as { total: number };
  return total;
};

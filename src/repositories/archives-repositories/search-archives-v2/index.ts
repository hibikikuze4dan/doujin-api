import { type Database } from "better-sqlite3";
import { ALLOWED_SORT_COLLUMNS } from "../../../constants";
import { countArchives } from "./countArchives";
import { searchArchives } from "./searchArchives";
import { SearchArchivesParams } from "../types";

export const searchArchivesV2 = (db: Database) => {
  const allowedSortColumns = new Set(ALLOWED_SORT_COLLUMNS);

  function searchArchivesWithMeta(params: SearchArchivesParams) {
    const archivesPerPage = Math.max(1, (params.archivesPerPage ?? 50) | 0);
    const total = countArchives({ ...params, db });
    const totalPages = Math.max(1, Math.ceil(total / archivesPerPage));
    const results = searchArchives({ ...params, allowedSortColumns, db });
    return {
      results,
      total,
      totalPages,
      resultsPage: Math.max(1, (params.resultsPage ?? 1) | 0),
      archivesPerPage,
    };
  }

  return { searchArchives, countArchives, searchArchivesWithMeta };
};

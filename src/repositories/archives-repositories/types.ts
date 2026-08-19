import { type Database } from "better-sqlite3";
import { type ParsedQs } from "qs";
import { QueryParameter } from "../../types/general";

export type DatabaseQueryBindings = (string | number | null)[];

export type DatabaseQueryConditions = string[];

export interface ArchiveEntryParams {
  name?: string;
  filepath?: string;
  date_created?: string;
  pagecount?: number;
  size?: number;
}

export type BuildFiltersParams = {
  query?: QueryParameter;
  min_rating?: QueryParameter;
  max_rating?: QueryParameter;
  min_pages?: QueryParameter;
  max_pages?: QueryParameter;
  min_size?: QueryParameter;
  max_size?: QueryParameter;
  min_tags?: QueryParameter;
  max_tags?: QueryParameter;
  added_after?: QueryParameter;
  added_before?: QueryParameter;
  created_after?: QueryParameter;
  created_before?: QueryParameter;
};

export type SearchArchivesParams = {
  allowedSortColumns?: Set<QueryParameter>;
  db?: Database;
  sort_by?: QueryParameter;
  sort_dir?: QueryParameter;
  resultsPage?: number;
  archivesPerPage?: number;
} & BuildFiltersParams;

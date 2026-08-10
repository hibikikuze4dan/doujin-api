import { type Database } from "better-sqlite3";

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
  query?: string | null;
  min_rating?: string | null;
  max_rating?: string | null;
  min_pages?: string | null;
  max_pages?: string | null;
  min_size?: string | null;
  max_size?: string | null;
  dateAddedFrom?: string | null;
  dateAddedTo?: string | null;
  dateCreatedFrom?: string | null;
  dateCreatedTo?: string | null;
};

export type SearchArchivesParams = {
  allowedSortColumns?: Set<string>;
  db?: Database;
  sortBy?: string;
  sortDir?: string;
  resultsPage?: number;
  archivesPerPage?: number;
} & BuildFiltersParams;

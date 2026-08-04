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
  minRating?: string | null;
  maxRating?: string | null;
  minPagecount?: string | null;
  maxPagecount?: string | null;
  minSize?: string | null;
  maxSize?: string | null;
  dateAddedFrom?: string | null;
  dateAddedTo?: string | null;
  dateCreatedFrom?: string | null;
  dateCreatedTo?: string | null;
};

export type SearchArchivesParams = {
  allowedSortColumns: Set<string>;
  db: Database;
  sortBy?: string;
  sortDir?: string;
  resultsPage?: number;
  archivesPerPage?: number;
} & BuildFiltersParams;

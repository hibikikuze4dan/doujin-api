export type DatabaseQueryBindings = (string | number | null)[];

export type DatabaseQueryConditions = string[];

export interface ArchiveEntryParams {
  name?: string;
  filepath?: string;
  date_created?: string;
  pagecount?: number;
  size?: number;
}

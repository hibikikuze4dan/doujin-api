import StreamZip from "node-stream-zip";

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export type StreamZipEntries = {
  [name: string]: StreamZip.ZipEntry;
};

export interface LanraragiBackupArchive {
  title: string;
  arcid: string;
  tags: string;
  filename: string;
  summary: string;
  thumbhash: string;
}

type AllowedSortFields =
  | "name"
  | "size"
  | "pagecount"
  | "date_added"
  | "date_created"
  | "rating"
  | "random";
export interface SearchArchivesQuery {
  q?: string;
  q_mode?: "and" | "or";
  tags?: string;
  tag_mode?: "and" | "or";
  min_pages?: string | number;
  max_pages?: string | number;
  min_size?: string | number;
  max_size?: string | number;
  min_rating?: string | number;
  max_rating?: string | number;
  min_tags?: string | number;
  max_tags?: string | number;
  added_after?: string;
  added_before?: string;
  created_after?: string;
  created_before?: string;
  collection?: string;
  sort_by?: AllowedSortFields;
  sort_direction?: "asc" | "desc";
  page?: number;
  archivesPerPage?: number;
  include_total_results?: boolean;
}

export type AddOrRemove = "add" | "remove";

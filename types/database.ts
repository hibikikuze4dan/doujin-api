export interface Archive {
  name: string;
  filepath: string;
  id: number;
  date_created: string;
  date_added: string;
  pagecount: number;
  size: number;
}

export interface ArchiveWithConnectedTableData extends Archive {
  rating: number;
  tags: string;
}

export type ArchiveTableGetResponse = ArchiveWithConnectedTableData | undefined;

export type ArchiveTableAllRespnse = ArchiveWithConnectedTableData[];

export interface Tag {
  id: number;
  archive_id: number;
  name: string;
  namespace: string;
}

export interface ArchiveHistory {
  id: number;
  archive_id: number;
  last_page: number;
  accessed_at: number;
}

export interface User {
  id: number;
  created_at: string;
  username: string;
  password: string;
  salt: string;
}

export interface ArchiveRating {
  id: number;
  archive_id: number;
  user_id: number;
  rating: number;
  rated_at: string;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  date_added: string;
}

export interface CollectionArchive {
  colleciton_id: number;
  archive_id: number;
  date_added: string;
}

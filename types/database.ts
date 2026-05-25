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

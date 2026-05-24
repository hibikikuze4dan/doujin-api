export type TaggingData = {
  name: string;
  filename: string;
  data?: string[];
};

export type ConfigData = {
  content_directory: string;
  lrr_database_backup_path: string;
  thumbnail_directory: string;
  tagging: TaggingData[];
};

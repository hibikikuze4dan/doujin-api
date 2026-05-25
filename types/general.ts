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

export type LanraragiBackupArchive = {
  title: string;
  arcid: string;
  tags: string;
  filename: string;
  summary: string;
  thumbhash: string;
};

import { LanraragiBackupArchive } from "../../types/general";

export const getLanraragiTagsByFilename = ({
  archives = [] as LanraragiBackupArchive[],
  filename = "",
} = {}) => {
  if (!archives?.length || !filename) {
    return "";
  }

  const archive = archives.find((arc) => arc?.filename === filename);

  return archive?.tags ?? "";
};

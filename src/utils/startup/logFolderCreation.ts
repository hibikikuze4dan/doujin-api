import { LOGS_DIR } from "../../constants";
import { createDirectory } from "../filesystem";

export const logFolderCreation = async () => {
  createDirectory(LOGS_DIR, { recursive: true });
};

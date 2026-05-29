import { archivesQueries } from "../../db";
import { deleteFile } from "../../utils";

export const deleteArchivesId = async (
  id: number,
  shouldDeleteFile = false,
) => {
  if (!id) {
    return null;
  }

  const archive = archivesQueries.getArchiveById(id);
  const removalSuccessful = archivesQueries.removeArchiveEntry(id);

  if (removalSuccessful && shouldDeleteFile) {
    await deleteFile(archive?.filepath);
  }

  return archive ?? null;
};

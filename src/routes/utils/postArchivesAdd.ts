import path from "path";
import {
  createTagsDatabaseInsertArray,
  createThumbnailForArchive,
  fileExists,
  getArchiveTags,
  getCompressedFileImages,
  getCompressedFilepaths,
  getFileStats,
  getLanraragiDatabaseBackup,
  getLanraragiTagsByFilename,
  getUserConfigs,
} from "../../../utils";
import { LanraragiBackupArchive } from "../../../types/general";
import { archivesQueries, tagsQueries } from "../../../db";

export const postArchivesAdd = async () => {
  const newArchives = [];

  try {
    const { content_directory = "" } = (await getUserConfigs()) ?? {};
    const resolvedContentDirectory = path.resolve(content_directory);

    if (!(await fileExists(resolvedContentDirectory))) {
      return ["Content directory does not exist!"];
    }

    let lanraragiBackupData =
      (await getLanraragiDatabaseBackup()) as unknown as {
        archives: LanraragiBackupArchive[];
      } | null;

    const archives = lanraragiBackupData?.archives;
    lanraragiBackupData = null;

    const newRowIds = [];
    const filepaths = await getCompressedFilepaths(resolvedContentDirectory);

    const newFilepaths = filepaths.filter((filepath) => {
      const archive = archivesQueries.getArchiveByFilepath(filepath);
      const archiveExists = !!archive;
      return !archiveExists;
    });

    for (const filepath of newFilepaths) {
      try {
        const fileStats = await getFileStats(filepath);

        const archiveEntry = archivesQueries.getArchiveByFilepath(filepath);
        if (!archiveEntry && fileStats) {
          const filename = path.basename(filepath);
          const filenameWithoutExtension = path.parse(filepath).name;

          let tags = "";

          if (archives) {
            tags = getLanraragiTagsByFilename({
              archives,
              filename: filenameWithoutExtension,
            });
          }

          if (!tags) {
            tags = await getArchiveTags(filepath);
          }

          const newRowId = archivesQueries.createArchiveEntry({
            name: filename,
            filepath,
            date_created: fileStats.birthtime.toISOString(),
            pagecount: (await getCompressedFileImages(filepath)).length,
            size: fileStats.size,
          });

          newRowIds.push(newRowId);

          const tagsArray = createTagsDatabaseInsertArray(
            newRowId,
            tags,
          ).filter((tag) => !!tag);
          tagsQueries.addTags(tagsArray);

          await createThumbnailForArchive(newRowId, filepath);
        }
      } catch (error) {
        console.error(
          `Skipping archive ${filepath} because it failed during import:\n${error}`,
        );
        continue;
      }
    }

    for (const id of newRowIds) {
      const archive = archivesQueries.getArchiveById(id);

      if (archive) {
        newArchives.push(archive);
      }
    }

    return newArchives;
  } catch {
    return newArchives;
  }
};

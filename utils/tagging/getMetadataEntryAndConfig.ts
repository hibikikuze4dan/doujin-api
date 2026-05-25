import path from "path";
import StreamZip from "node-stream-zip";
import { getUserConfigs } from "../configuration";
import { getCompressedFileEntries } from "../filesystem";
import { type StreamZipEntries } from "../../types/general";
import { type TaggingData } from "../../types/configuration";

export const getMetadataEntryAndConfig = async (
  filepath = "",
  entries: StreamZipEntries,
) => {
  if (!filepath) {
    return null;
  }

  const configs = await getUserConfigs();
  const taggingConfigs = configs?.tagging ?? [];

  if (!taggingConfigs?.length) {
    return null;
  }

  let compressedFileEntries = entries;

  if (!Object.keys(compressedFileEntries)?.length) {
    compressedFileEntries = await getCompressedFileEntries();
  }

  let metadataEntry: StreamZip.ZipEntry | undefined;
  let taggingConfigToUse: TaggingData | undefined;

  metadataEntry = Object.values(compressedFileEntries)?.find((entry) => {
    for (const config of taggingConfigs) {
      if (config?.filename === entry?.name) {
        taggingConfigToUse = config;
        return true;
      }
    }
  });

  if (!metadataEntry || !taggingConfigToUse) {
    return null;
  }

  return {
    entry: metadataEntry,
    tagConfig: taggingConfigToUse,
    extension: path.extname(metadataEntry?.name),
  };
};

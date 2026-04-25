const path = require("path");
const { getUserConfigs } = require("../configuration");
const { getCompressedFileEntries } = require("../filesystem");

exports.getMetadataEntryAndConfig = async (filepath = "", entries) => {
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

  let metadataEntry;
  let taggingConfigToUse;

  metadataEntry = Object.values(compressedFileEntries)?.find((entry) => {
    for (config of taggingConfigs) {
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

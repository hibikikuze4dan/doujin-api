const path = require("path");
const { getUserConfigs } = require("../configuration");
const { getCompressedFileEntries } = require("../filesystem");

exports.getMetadataEntryAndConfig = async (filepath = "", entries = []) => {
  if (!filepath) {
    return null;
  }

  const taggingConfigs = (await getUserConfigs())?.tagging ?? [];

  if (!taggingConfig?.length) {
    return null;
  }

  let compressedFileEntries = entries;

  if (!compressedFileEntries?.length) {
    compressedFileEntries = await getCompressedFileEntries();
  }

  let metadataEntry;
  let taggingConfigToUse;

  metadataEntry = compressedFileEntries.find((entry) => {
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
    extension: path.extname(entry?.name),
  };
};

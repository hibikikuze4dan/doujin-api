const path = require("path");
const { getUserConfigs } = require("../configuration");
const { getCompressedFileEntries } = require("../filesystem");

exports.findMetadataEntry = async (filepath = "") => {
  if (!filepath) {
    return null;
  }

  const taggingConfig = (await getUserConfigs())?.tagging ?? [];

  if (!taggingConfig?.length) {
    return null;
  }

  const metadataFilenames =
    taggingConfig?.map((tagger) => {
      return tagger?.filename ?? "";
    }) ?? [];

  const entries = await getCompressedFileEntries();

  const metadataEntry = entries.find((entry) => {
    return metadataFilenames?.includes(entry?.name);
  });

  return metadataEntry ?? null;
};

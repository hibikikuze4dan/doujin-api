const { XMLParser } = require("fast-xml-parser");

const {
  getCompressedFileEntries,
  getCompressedFileEntryBufferString,
} = require("../filesystem");
const { getMetadataEntryAndConfig } = require("./getMetadataEntryAndConfig");
const { createTagsString } = require("./createTagsString");

exports.getArchiveTags = async (filepath) => {
  if (!filepath) {
    return null;
  }

  try {
    const entries = await getCompressedFileEntries(filepath);
    const metadataConfigAndEntry = await getMetadataEntryAndConfig(
      filepath,
      entries,
    );

    const metadataEntryExtension = metadataConfigAndEntry?.extension;
    const metadataEntry = metadataConfigAndEntry?.entry;
    const tagConfig = metadataConfigAndEntry?.tagConfig;
    const metadataEntryBufferString = await getCompressedFileEntryBufferString(
      filepath,
      metadataEntry,
    );
    let metadata;

    if (metadataEntryExtension === ".json") {
      return createTagsString(
        JSON.parse(metadataEntryBufferString),
        tagConfig?.data,
      );
    } else if (metadataEntryExtension === ".xml") {
      return createTagsString(
        new XMLParser().parse(metadataEntryBufferString),
        tagConfig?.data,
      );
    } else if (metadataEntryExtension === ".txt") {
      return metadataEntryBufferString;
    } else {
      return "";
    }
  } catch (error) {
    console.error(
      `Something went wrong while trying to get the tags for archive ${filepath}:\n${error}`,
    );
    return "";
  }
};

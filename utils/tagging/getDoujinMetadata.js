const { XMLParser } = require("fast-xml-parser");

const {
  getCompressedFileEntries,
  getCompressedFileEntryBufferString,
} = require("../filesystem");
const { getMetadataEntryAndConfig } = require("./getMetadataEntryAndConfig");

exports.getDoujinMetadata = async (filepath) => {
  if (!filepath || !metadataFilename) {
    return null;
  }

  const entries = await getCompressedFileEntries(filepath);
  const metadataConfigAndEntry = await getMetadataEntryAndConfig(entries);

  const metadataEntryExtension = metadataConfigAndEntry?.extension;
  const metadataEntry = metadataConfigAndEntry?.entry;
  const metadataEntryBufferString = await getCompressedFileEntryBufferString(
    filepath,
    metadataEntry,
  );
  let metadata;

  if (metadataEntryExtension === ".json") {
    return JSON.parse(metadataEntryBufferString);
  } else if (metadataEntryExtension === ".xml") {
    return new XMLParser().parse(metadataEntryBufferString);
  } else if (metadataEntryExtension === ".txt") {
    return metadataEntryBufferString;
  } else {
    return metadataEntryBufferString;
  }
};

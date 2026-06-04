import { XMLParser } from "fast-xml-parser";
import { createTagsString, getCompressedFileEntryBufferString } from "..";
import { getCompressedFileEntries } from "../filesystem";
import { getMetadataEntryAndConfig } from "./getMetadataEntryAndConfig";

export const getArchiveTags = async (filepath?: string) => {
  if (!filepath) {
    return "";
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

    if (metadataEntryExtension === ".json") {
      return createTagsString(
        JSON.parse(metadataEntryBufferString ?? ""),
        tagConfig?.data,
      );
    } else if (metadataEntryExtension === ".xml") {
      return createTagsString(
        new XMLParser().parse(metadataEntryBufferString ?? ""),
        tagConfig?.data,
      );
    } else if (metadataEntryExtension === ".txt") {
      return metadataEntryBufferString ?? "";
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

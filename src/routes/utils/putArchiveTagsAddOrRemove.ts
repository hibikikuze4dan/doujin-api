import { archivesQueries, tagsQueries } from "../../db";
import { AddOrRemove } from "../../types/general";
import { createTagsDatabaseInsertObject } from "../../utils";
import { parseAddOrRemove } from "../../utils/query";

export const putArchiveTagsAddOrRemove = async ({
  archiveId,
  tags,
  addOrRemove,
}: {
  archiveId: number | undefined;
  tags: string[];
  addOrRemove: AddOrRemove | string;
}) => {
  let errorMessage: string | undefined;

  if (!archiveId) {
    errorMessage = "Please provide a valid archive id";
    return { status: "error", message: errorMessage, data: null };
  } else if (!tags.length) {
    errorMessage = "Please provide tags to " + addOrRemove;
    return { status: "error", message: errorMessage, data: null };
  }

  const addOrRemoveParsed = parseAddOrRemove(addOrRemove);
  const allFalse = Object.values(addOrRemoveParsed).every(
    (value) => value === false,
  );

  if (allFalse) {
    errorMessage = "Please use a valid action for tags";
    return { status: "error", message: errorMessage, data: null };
  }

  const archive = archivesQueries.getArchiveById(archiveId);

  if (!archive) {
    errorMessage = "No archive was found with the supplied archive id";
    return { status: "error", message: errorMessage, data: null };
  }

  const [shouldAddOrRemove] = Object.entries(addOrRemoveParsed).find(
    (entry) => entry?.[1] === true,
  ) ?? [""];

  for (const tag of tags) {
    const tagInsertObject = createTagsDatabaseInsertObject(archiveId, tag);

    if (tagInsertObject) {
      const tagExists =
        tagsQueries.getTagsByArchiveIdNameAndNamespace(tagInsertObject);

      if (!tagExists && shouldAddOrRemove === "add") {
        tagsQueries.addTag(tagInsertObject);
      } else if (tagExists && shouldAddOrRemove === "remove") {
        tagsQueries.deleteTagByArchiveIdAndTagData(tagInsertObject);
      }
    }
  }

  const updatedArchive = archivesQueries.getArchiveById(archiveId);

  return { status: "success", message: "", data: updatedArchive };
};

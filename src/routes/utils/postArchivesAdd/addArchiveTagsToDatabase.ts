import { Tag, type ArchiveTag } from "../../../../types/database";
import {
  archiveTagQueries,
  tagCategoryQueries,
  tagsQueries,
} from "../../../db";

export const addArchiveTagsToDatabase = (
  tagDataArray: {
    archive_id: number;
    name: string;
    category: string | null;
  }[],
) => {
  const archiveTags: ArchiveTag[] = [];
  const categories = tagCategoryQueries.getAllTagCategoryRows();

  tagDataArray.forEach((tagData) => {
    const tagCategory = tagData?.category;
    let tagCategoryId: number | null = null;
    let existingTag: Tag | undefined = undefined;

    if (tagCategory) {
      const existingCategory = categories.find((tc) => tc.name === tagCategory);

      if (!existingCategory) {
        tagCategoryQueries.addTagCategory({ name: tagCategory });

        const newTagCategory = tagCategoryQueries.getTagCategory({
          name: tagCategory,
        });

        if (newTagCategory) {
          categories.push(newTagCategory);
          tagCategoryId = newTagCategory.id;
        }
      } else {
        tagCategoryId = existingCategory.id;
      }
    }

    existingTag = tagsQueries.getTag("[name, category_id]", [
      tagData.name,
      tagCategoryId,
    ]);

    if (!existingTag) {
      const addNewTagResult = tagsQueries.addTag({
        category_id: tagCategoryId,
        name: tagData.name,
      });

      existingTag = tagsQueries.getTag("id", addNewTagResult.lastInsertRowid);
    }

    if (existingTag) {
      const addNewArchiveTagResult = archiveTagQueries.addArchiveTag({
        archive_id: tagData.archive_id,
        tag_id: existingTag.id,
      });

      if (addNewArchiveTagResult.changes) {
        const newArchiveTag = archiveTagQueries.getArchiveTag(
          addNewArchiveTagResult.lastInsertRowid,
        );
        archiveTags.push(newArchiveTag as ArchiveTag);
      }
    }
  });

  return archiveTags;
};

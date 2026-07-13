import express from "express";
import { archivesQueries, tagsQueries } from "../db";
import { SearchArchivesQuery } from "../../types/general";
import { parseAddOrRemove, parseNumericQuery } from "../utils/query";
import {
  deleteArchivesId,
  getArchivesIdPages,
  getArchivesIdThumbnail,
  postArchivesAdd,
  putArchivesRating,
  putArchiveTagsAddOrRemove,
} from "./utils";
import { getNumOfNewArchives } from "../db-utils";
import { createTagsDatabaseInsertObject, getUserConfigs } from "../utils";
import { authenticateToken } from "./middleware";

const router = express.Router();

// NOTE: TEST ROUTE. NEEDS TO BE CLEANED UP LATER
router.get("/", async (req, res, _next) => {
  res.json("test route");
});

router.get("/all", async (req, res, _next) => {
  const archives = archivesQueries.getAllArchives();

  res.json(archives);
});

router.get("/search", async (req, res, _next) => {
  const {
    q,
    q_mode,
    tags,
    tag_mode,
    min_pages,
    max_pages,
    min_size,
    max_size,
    min_rating,
    max_rating,
    min_tags,
    max_tags,
    added_after,
    added_before,
    created_after,
    created_before,
    collection,
    sort_by,
    sort_direction,
    page,
    include_total_results,
    q_match_mode,
  } = req?.query ?? {};

  const configData = await getUserConfigs();
  const pageNumber = parseNumericQuery(page);
  const pageNumberToUse = pageNumber ? pageNumber : 1;

  const includeTotalResults =
    include_total_results === "false" || include_total_results === "0"
      ? false
      : true;

  const { archives, totalResults } =
    archivesQueries.searchArchives({
      q,
      q_mode,
      tags,
      tag_mode,
      min_pages: min_pages,
      max_pages: max_pages,
      min_size: min_size,
      max_size: max_size,
      min_rating: min_rating,
      max_rating: max_rating,
      min_tags,
      max_tags,
      added_after,
      added_before,
      created_after,
      created_before,
      collection,
      sort_by,
      sort_direction,
      q_match_mode,
      page: pageNumberToUse,
      archivesPerPage: configData.archives_per_page,
      include_total_results: includeTotalResults,
    } as SearchArchivesQuery) ?? {};

  res.json({ archives, totalResults, page: pageNumberToUse });
});

router.get("/random", async (req, res, _next) => {
  const count = req?.query?.count ?? 5;

  const archives = archivesQueries.getRandomEntries(
    parseNumericQuery(count) ?? 5,
  );

  res.json(archives);
});

router.get("/:id", async (req, res, _next) => {
  const archive_id = req.params.id;

  if (!archive_id) {
    res.status(400).send("Please provide a valid archive ID");
    return;
  }

  const archive = archivesQueries.getArchiveById(archive_id);

  if (!archive) {
    res.status(400).send("No archive found with the supplied archive ID");
    return;
  }

  res.send(archive);
});

router.get("/:id/pages", async (req, res, _next) => {
  const id = req.params?.id;

  if (!id) {
    res.status(400).send("Invalid archive id provided");
    return;
  }

  const numericId = parseNumericQuery(id);

  if (numericId) {
    const imageLinks = await getArchivesIdPages(numericId);

    res.json(imageLinks);
  } else {
    res.status(400).json("Invalid archive id provided");
  }
});

router.get("/:id/thumbnail", async (req, res, _next) => {
  const id = req.params.id;

  const archive = archivesQueries.getArchiveById(id);
  const archiveThumbnailImagePath = await getArchivesIdThumbnail(
    archive?.id,
    archive?.filepath,
  );

  res.json(archiveThumbnailImagePath);
});

router.post("/add", async (req, res, _next) => {
  const userConfig = await getUserConfigs();
  const numberOfNewArchives = await getNumOfNewArchives({
    contentDirectory: userConfig.content_directory,
  });

  postArchivesAdd();

  res.json(
    `Found ${numberOfNewArchives} new archive(s). Beggining process of adding new archives to the library. Check the logs for more details.`,
  );
});

// TODO: Update user rating if rating already exists
router.put("/rating", async (req, res, _next) => {
  const { arcid: archive_id, rating, userid: user_id } = req?.body ?? {};

  const { status, data } = await putArchivesRating({
    archive_id,
    user_id,
    rating,
  });

  res.status(status).json(data);
});

router.put(
  "/:id/tags/:addOrRemove",
  authenticateToken,
  async (req, res, _next) => {
    const archive_id = req?.params?.id;
    const arcId = Array.isArray(archive_id)
      ? (archive_id[0] ?? "")
      : `${archive_id ?? ""}`;

    const AOR = req?.params?.addOrRemove ?? "";
    const addOrRemove = Array.isArray(AOR) ? "" : AOR;

    const tags: string[] = req?.body?.tags ?? [];

    const results = await putArchiveTagsAddOrRemove({
      archiveId: parseNumericQuery(arcId),
      addOrRemove,
      tags,
    });

    res.json(results);
  },
);

router.delete("/:id", authenticateToken, async (req, res, _next) => {
  const id = req.params.id;
  const delete_file = req?.body?.delete_file;

  const archive = await deleteArchivesId(
    parseNumericQuery(id),
    delete_file === true,
  );

  res.json(archive);
});

export default router;

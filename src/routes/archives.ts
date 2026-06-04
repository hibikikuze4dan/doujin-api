import express from "express";
import { archivesQueries } from "../db";
import { SearchArchivesQuery } from "../../types/general";
import { parseNumericQuery } from "../../utils/query";
import {
  deleteArchivesId,
  getArchivesIdPages,
  getArchivesIdThumbnail,
  postArchivesAdd,
  putArchivesRating,
} from "./utils";
import { getNumOfNewArchives } from "../db-utils";
import { getUserConfigs } from "../../utils";

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
    tag,
    tag_mode,
    min_pages,
    max_pages,
    min_size,
    max_size,
    min_rating,
    max_rating,
    added_after,
    added_before,
    created_after,
    created_before,
    collection,
    sort_by,
    sort_direction,
  } = req?.query ?? {};

  const results =
    archivesQueries.searchArchives({
      q,
      q_mode,
      tag,
      tag_mode,
      min_pages: parseNumericQuery(min_pages),
      max_pages: parseNumericQuery(max_pages),
      min_size: parseNumericQuery(min_size),
      max_size: parseNumericQuery(max_size),
      min_rating: parseNumericQuery(min_rating),
      max_rating: parseNumericQuery(max_rating),
      added_after,
      added_before,
      created_after,
      created_before,
      collection,
      sort_by,
      sort_direction,
    } as SearchArchivesQuery)?.results ?? [];

  const archives = results;

  res.json(archives);
});

router.get("/random", async (req, res, _next) => {
  const count = req?.query?.count ?? 5;

  const archives = archivesQueries.getRandomEntries(
    parseNumericQuery(count) ?? 5,
  );

  res.json(archives);
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

router.delete("/:id", async (req, res, _next) => {
  const id = req.params.id;
  const deleteFile = req?.body?.deleteFile;

  const archive = await deleteArchivesId(parseNumericQuery(id), deleteFile);

  res.json(archive);
});

export default router;

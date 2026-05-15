const express = require("express");
const { archivesQueries } = require("../db");
const { getArchiveTags } = require("../utils");
const { getArchiveWithTags } = require("../db-utils");
const {
  getArchivesIdPages,
  getArchivesIdThumbnail,
  postArchivesAdd,
  deleteArchivesId,
} = require("./utils");

var router = express.Router();

// NOTE: TEST ROUTE. NEEDS TO BE CLEANED UP LATER
router.get("/", async (req, res, _next) => {
  const tags = await getArchiveTags("");
  res.json(tags);
});

router.get("/all", async (req, res, _next) => {
  const archives = archivesQueries
    .getAllArchives()
    ?.map((archive) => getArchiveWithTags(archive?.id));

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
    added_after,
    added_before,
    created_after,
    created_before,
    collection,
  } = req?.query ?? {};

  let results;
  if (!q && !tag) {
    results = archivesQueries.getAllArchives();
  } else {
    results =
      archivesQueries.searchArchives({
        q,
        q_mode,
        tag,
        tag_mode,
        min_pages,
        max_pages,
        min_size,
        max_size,
        added_after,
        added_before,
        created_after,
        created_before,
        collection,
      })?.results ?? [];
  }

  const archives = results?.map((archive) => getArchiveWithTags(archive?.id));

  res.json(archives);
});

router.get("/random", async (req, res, _next) => {
  const count = req?.query?.count ?? 5;

  const archives = archivesQueries
    .getRandomEntries(count)
    ?.map((archive) => getArchiveWithTags(archive?.id));

  res.json(archives);
});

router.get("/:id/pages", async (req, res, _next) => {
  const id = req.params.id;

  const imageLinks = await getArchivesIdPages(id);

  res.json(imageLinks);
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
  const archives = await postArchivesAdd();

  res.json(archives);
});

router.delete("/:id", async (req, res, _next) => {
  const id = req.params.id;
  const deleteFile = req?.body?.deleteFile;

  const archive = await deleteArchivesId(id, deleteFile);

  res.json(archive);
});

module.exports = router;

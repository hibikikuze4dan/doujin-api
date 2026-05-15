const express = require("express");
const { archivesQueries } = require("../db");
const { getArchiveTags } = require("../utils");
const { getArchiveWithTags } = require("../db-utils");
const {
  getDoujinsIdPages,
  getDoujinsIdThumbnail,
  postArchivesAdd,
  deleteDoujinsId,
} = require("./utils");

var router = express.Router();

// NOTE: TEST ROUTE. NEEDS TO BE CLEANED UP LATER
router.get("/", async (req, res, _next) => {
  const tags = await getArchiveTags("");
  res.json(tags);
});

router.get("/all", async (req, res, _next) => {
  const doujins = archivesQueries
    .getAllArchives()
    ?.map((archive) => getArchiveWithTags(archive?.id));

  res.json(doujins);
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

  const doujins = results?.map((archive) => getArchiveWithTags(archive?.id));

  res.json(doujins);
});

router.get("/random", async (req, res, _next) => {
  const count = req?.query?.count ?? 5;

  const doujins = archivesQueries
    .getRandomEntries(count)
    ?.map((archive) => getArchiveWithTags(archive?.id));

  res.json(doujins);
});

router.get("/:id/pages", async (req, res, _next) => {
  const id = req.params.id;

  const imageLinks = await getDoujinsIdPages(id);

  res.json(imageLinks);
});

router.get("/:id/thumbnail", async (req, res, _next) => {
  const id = req.params.id;

  const doujin = archivesQueries.getArchiveById(id);
  const doujinThumbnailImagePath = await getDoujinsIdThumbnail(
    doujin?.id,
    doujin?.filepath,
  );

  res.json(doujinThumbnailImagePath);
});

router.post("/add", async (req, res, _next) => {
  const doujins = await postArchivesAdd();

  res.json(doujins);
});

router.delete("/:id", async (req, res, _next) => {
  const id = req.params.id;
  const deleteFile = req?.body?.deleteFile;

  const doujin = await deleteDoujinsId(id, deleteFile);

  res.json(doujin);
});

module.exports = router;

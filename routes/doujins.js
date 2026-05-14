const express = require("express");
const path = require("path");
const { getUserConfigs } = require("../utils/configuration");
const {
  TEMP_IMAGE_DIRECTORY_PATH,
  THUMBNAIL_IMAGE_DIRECTORY_PATH,
  DOUJIN_IMAGES_DIRECTORY_PATH,
  IMAGE_EXTENSIONS,
} = require("../constants");
const { doujinsQueries } = require("../db");
const { getLanraragiDatabaseBackup, getDoujinTags } = require("../utils");
const { getArchiveWithTags } = require("../db-utils");
const {
  getDoujinsIdPages,
  getDoujinsIdThumbnail,
  postDoujinsAdd,
  deleteDoujinsId,
} = require("./utils");

var router = express.Router();

router.get("/", async (req, res, next) => {
  const data = await getLanraragiDatabaseBackup();
  const tags = await getDoujinTags("");
  res.json(tags);
});

router.get("/all", async (req, res, next) => {
  const doujins = doujinsQueries
    .getAllDoujins()
    ?.map((archive) => getArchiveWithTags(archive?.id));

  res.json(doujins);
});

router.get("/search", async (req, res, next) => {
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
    results = doujinsQueries.getAllDoujins();
  } else {
    results =
      doujinsQueries.searchArchives({
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

router.get("/random", async (req, res, next) => {
  const count = req?.query?.count ?? 5;

  const doujins = doujinsQueries
    .getRandomEntries(count)
    ?.map((archive) => getArchiveWithTags(archive?.id));

  res.json(doujins);
});

router.get("/:id/pages", async (req, res, next) => {
  const id = req.params.id;

  const imageLinks = await getDoujinsIdPages(id);

  res.json(imageLinks);
});

router.get("/:id/thumbnail", async (req, res, next) => {
  const id = req.params.id;

  const doujin = doujinsQueries.getDoujinById(id);
  const doujinThumbnailImagePath = await getDoujinsIdThumbnail(
    doujin?.id,
    doujin?.filepath,
  );

  res.json(doujinThumbnailImagePath);
});

router.post("/add", async (req, res, next) => {
  const doujins = await postDoujinsAdd();

  res.json(doujins);
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const deleteFile = req?.body?.deleteFile;

  const doujin = await deleteDoujinsId(id, deleteFile);

  res.json(doujin);
});

module.exports = router;

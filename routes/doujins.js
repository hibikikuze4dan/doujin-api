const express = require("express");
const path = require("path");
const {
  unzipFileContents,
  getFiles,
  deleteFolderContents,
  getCompressedFilepaths,
  getFileStats,
  getCompressedFileImages,
  extractFirstImage,
  createThumbnail,
  postDoujinsAdd,
  getImageFiles,
  getDoujinsIdPages,
  deleteFile,
  deleteDoujinsId,
  getLanraragiDatabaseBackup,
  getDoujinTags,
  fileExists,
  createThumbnailForDoujin,
  getDoujinsIdThumbnail,
  getArchiveWithTags,
} = require("../utils");
const { getUserConfigs } = require("../utils/configuration");
const {
  createDoujinEntry,
  getAllDoujins,
  getDoujinById,
  removeDoujinEntry,
  getRandomEntries,
} = require("../repositories");
const {
  TEMP_IMAGE_DIRECTORY_PATH,
  THUMBNAIL_IMAGE_DIRECTORY_PATH,
  DOUJIN_IMAGES_DIRECTORY_PATH,
  IMAGE_EXTENSIONS,
} = require("../constants");
const { doujinsQueries } = require("../db");

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

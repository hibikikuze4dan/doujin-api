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

var router = express.Router();

/* GET users listing. */
router.get("/", async (req, res, next) => {
  res.json({});
});

router.get("/all", async (req, res, next) => {
  const doujins = getAllDoujins();

  res.json(doujins);
});

router.get("/random", async (req, res, next) => {
  const count = req?.query?.count ?? 5;

  const doujins = getRandomEntries(count);

  res.json(doujins);
});

router.get("/:id/pages", async (req, res, next) => {
  const id = req.params.id;

  const imageLinks = await getDoujinsIdPages(id);

  res.json(imageLinks);
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

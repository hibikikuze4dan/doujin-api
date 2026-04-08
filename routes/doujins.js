const express = require("express");
const path = require("path");
const {
  unzipFileContents,
  getFiles,
  deleteFolderContents,
} = require("../utils/filesystem");
const { getUserConfigs } = require("../utils/configuration");

var router = express.Router();

/* GET users listing. */
router.get("/", async (req, res, next) => {
  const data = await getUserConfigs();

  res.json(data);
});

module.exports = router;

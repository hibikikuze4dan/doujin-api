const express = require("express");
const { fileExists, unzipFileContents } = require("../utils");
const { ARCHIVE_IMAGES_DIRECTORY_PATH } = require("../constants");
const path = require("node:path");
const { archivesQueries } = require("../db");

const router = express.Router();

// TODO: Return default no image found image if verify is false and image doesn't exist
router.get("/images/archive/:archiveId/:filename", async (req, res, next) => {
  const archiveId = req.params.archiveId;
  const filename = req.params.filename;
  const { verify = "false" } = req.query ?? {};

  if (verify === "true") {
    if (archiveId && filename) {
      const archiveImagesOutputDirectory = path.resolve(
        path.join(ARCHIVE_IMAGES_DIRECTORY_PATH, `${archiveId}`),
      );

      const doesFileExist = await fileExists(
        path.join(archiveImagesOutputDirectory, filename),
      );

      if (!doesFileExist) {
        console.log("File doesn't exist");
        const archive = archivesQueries.getArchiveById(archiveId);

        await unzipFileContents(
          archive?.filepath,
          archiveImagesOutputDirectory,
        );
      }
    } else {
      res.status(400).send("Archive Id and Filename are required");
    }
  }

  next();
});

module.exports = router;

const express = require("express");
const { fileExists, unzipFileContents } = require("../utils");
const {
  ARCHIVE_IMAGES_DIRECTORY_PATH,
  THUMBNAIL_NOT_FOUND_IMAGE_PATH,
  IMAGE_EXTENSIONS,
} = require("../constants");
const path = require("node:path");
const { archivesQueries } = require("../db");

const router = express.Router();

// TODO: Return default no image found image if verify is false and image doesn't exist
router.get("/images/archive/:archiveId/:filename", async (req, res, next) => {
  const archiveId = req.params.archiveId;
  const filename = req.params.filename;
  const { verify = "false" } = req.query ?? {};

  const enableVerification = verify === "true";
  const isImageFile = IMAGE_EXTENSIONS.has(path.extname(filename));

  if (archiveId && filename && isImageFile) {
    const archiveImagesOutputDirectory = path.resolve(
      path.join(ARCHIVE_IMAGES_DIRECTORY_PATH, `${archiveId}`),
    );

    const doesFileExist = await fileExists(
      path.join(archiveImagesOutputDirectory, filename),
    );

    if (enableVerification && !doesFileExist) {
      const archive = archivesQueries.getArchiveById(archiveId);
      await unzipFileContents(archive?.filepath, archiveImagesOutputDirectory);
    }

    if (!enableVerification && !doesFileExist) {
      res.status(404).sendFile(THUMBNAIL_NOT_FOUND_IMAGE_PATH);
      return;
    }
  } else if (!isImageFile) {
    res.status(404).sendFile(THUMBNAIL_NOT_FOUND_IMAGE_PATH);
    return;
  }

  next();
});

module.exports = router;

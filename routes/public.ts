import { Router } from "express";
import path from "path";
import { getPublicImage } from "./utils";

const router = Router();

router.get("/images/archive/:archiveId/:filename", async (req, res, next) => {
  const archiveId = req.params.archiveId;
  const filename = req.params.filename;
  const { verify = "false" } = req.query ?? {};

  const imageNotFoundFilepath = await getPublicImage({
    archiveId,
    enableVerification: verify === "true",
    filename,
    isArchiveImage: true,
  });

  if (imageNotFoundFilepath) {
    res.status(404).sendFile(imageNotFoundFilepath);
    return;
  }

  next();
});

router.get("/images/thumbs/:filename", async (req, res, next) => {
  const filename = req.params.filename;
  const extension = path.extname(filename);
  const archiveId = path.basename(filename, extension);

  const { verify = "false" } = req.query ?? {};

  const imageNotFoundFilepath = await getPublicImage({
    archiveId,
    enableVerification: verify === "true",
    filename,
    isThumbnail: true,
  });

  if (imageNotFoundFilepath) {
    res.status(404).sendFile(imageNotFoundFilepath);
    return;
  }

  next();
});

export default router;

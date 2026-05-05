const express = require("express");
const { collectionsQueries } = require("../db");
const { postCollectionsIdAdd, postCollectionsAdd } = require("../utils/routes");

const router = express.Router();

router.get("/", (req, res, next) => {
  const collections = collectionsQueries.getAllCollections();
  res.json(collections);
});

router.post("/add", async (req, res, next) => {
  const { name = "", description = "" } = req?.body ?? {};

  const data = await postCollectionsAdd({ name, description });

  if (data) {
    res.json(data);
  } else {
    res.status(400).send("Error");
  }
});

router.post("/:collectionId/add", async (req, res, next) => {
  const { collectionId = "" } = req?.params ?? {};
  const { arcid = "" } = req?.body ?? {};

  const collectionData = postCollectionsIdAdd({
    collectionId,
    archiveId: arcid,
  });

  if (collectionData) {
    res.json(collectionData);
  } else {
    res.status(404).send("Error");
  }
});

module.exports = router;

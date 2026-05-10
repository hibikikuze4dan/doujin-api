const express = require("express");
const { collectionsQueries } = require("../db");
const { postCollectionsIdAdd, postCollectionsAdd } = require("./utils");
const { getCollectionWithArchives } = require("../db-utils");

const router = express.Router();

router.get("/all", async (req, res, next) => {
  const collections = collectionsQueries.getAllCollections();

  const collectionsWithDoujins = [];

  for (col of collections) {
    const data = await getCollectionWithArchives(col?.id);

    if (data) {
      collectionsWithDoujins.push(data);
    }
  }

  res.json(collectionsWithDoujins);
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

  const collectionData = await postCollectionsIdAdd({
    collectionId,
    archiveId: arcid,
  });

  if (collectionData) {
    res.json(collectionData);
  } else {
    res.status(404).send("Error");
  }
});

router.put("/:collectionId/remove", async (req, res, next) => {
  const collectionId = req?.params?.collectionId;
  const archiveId = req?.body?.arcid;

  const { changes, lastInsertRowid } =
    collectionsQueries.removeDoujinFromCollection(collectionId, archiveId);

  const collection = await getCollectionWithArchives(collectionId);

  res.json(collection);
});

router.delete("/", async (req, res, next) => {
  const { id: collectionId } = req?.body ?? {};

  const collection = await getCollectionWithArchives(collectionId);
  const { changes, lastInsertRowid } =
    collectionsQueries.removeCollectionById(collectionId);

  if (changes && lastInsertRowid) {
    res.json({
      status: "success",
      message: "Successfully removed collection",
      data: collection,
    });
  } else {
    res.status(400).send("Error");
  }
});

module.exports = router;

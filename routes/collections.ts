import { Router } from "express";
import { collectionsQueries } from "../db";
import { getCollectionWithArchives } from "../db-utils";
import { postCollectionsAdd, postCollectionsIdAdd } from "./utils";
import { parseNumericQuery } from "../utils/query";

const router = Router();

router.get("/all", async (req, res, _next) => {
  const collections = collectionsQueries.getAllCollections();

  const collectionsWithArchives = [];

  for (const col of collections) {
    const data = await getCollectionWithArchives(col?.id);

    if (data) {
      collectionsWithArchives.push(data);
    }
  }

  res.json(collectionsWithArchives);
});

router.post("/add", async (req, res, _next) => {
  const { name = "", description = "" } = req?.body ?? {};

  const data = await postCollectionsAdd({ name, description });

  if (data) {
    res.json(data);
  } else {
    res.status(400).send("Error");
  }
});

router.post("/:collectionId/add", async (req, res, _next) => {
  const { collectionId = "" } = req?.params ?? {};
  const { arcid = "" } = req?.body ?? {};

  const numericCollectionId = parseNumericQuery(collectionId);

  if (!numericCollectionId) {
    res.status(400).send("Please provide a valid collection id");
    return;
  }

  const collectionData = await postCollectionsIdAdd({
    collectionId: numericCollectionId,
    archiveId: arcid,
  });

  if (collectionData) {
    res.json(collectionData);
  } else {
    res.status(404).send("Error");
  }
});

router.put("/:collectionId/remove", async (req, res, _next) => {
  const collectionId = req?.params?.collectionId;
  const archiveId = req?.body?.arcid;

  const { changes } = collectionsQueries.removeArchiveFromCollection(
    collectionId,
    archiveId,
  );

  const numericCollectionId = parseNumericQuery(collectionId);

  if (!numericCollectionId || !changes) {
    res
      .status(400)
      .send(
        "Something went wrong while trying to remove archive from collection",
      );
    return;
  }

  const collection = await getCollectionWithArchives(numericCollectionId);

  res.json(collection);
});

router.delete("/", async (req, res, _next) => {
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

export default router;

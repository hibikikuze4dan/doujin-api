const express = require("express");
const { collectionsQueries } = require("../db");

const router = express.Router();

router.get("/", (req, res, next) => {
  const collections = collectionsQueries.getAllCollections();
  res.json(collections);
});

router.post("/add", (req, res, next) => {
  const { name = "", description = "" } = req?.body ?? {};

  try {
    if (name) {
      const { changes = 0, lastInsertRowid } =
        collectionsQueries?.createCollection(name, description);

      const collection = collectionsQueries?.getCollectionById(lastInsertRowid);

      if (changes && lastInsertRowid && collection) {
        res.json({
          status: "success",
          message: `Created new collection: ${name}`,
          data: collection,
        });
      }
      return;
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
    return;
  }

  res.status(400).send("Something went wrong");
});

router.post("/:collectionId/add", (req, res, next) => {
  const { collectionId = "" } = req?.params ?? {};
  const { arcid = "" } = req?.body ?? {};

  if (collectionId && arcid) {
    const { changes = 0, lastInsertRowid = 0 } =
      collectionsQueries?.addDoujinToCollection(collectionId, arcid);

    if (changes && lastInsertRowid) {
      const collection = collectionsQueries?.getCollectionById(collectionId);
      const archives = collectionsQueries?.getDoujinsInCollection(collectionId);

      res.json({
        ...collection,
        archives: archives,
      });

      return;
    }
  }

  res.status(404).send("Error");
});

module.exports = router;

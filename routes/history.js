const express = require("express");
const { collectionsQueries, historyQueries, doujinsQueries } = require("../db");
const { postCollectionsIdAdd, postCollectionsAdd } = require("../utils/routes");
const {
  getCollectionWithArchives,
} = require("../utils/database/getCollectionWithArchives");

const router = express.Router();

router.get("/all", async (req, res, next) => {
  const { withdata = "false" } = req?.query ?? {};

  const shouldGetData = withdata.toLocaleLowerCase() === "true";

  let history = historyQueries.getAllHistory();

  history = shouldGetData
    ? history.map((his) => {
        return {
          ...his,
          archive: doujinsQueries.getDoujinById(his?.doujin_id),
        };
      })
    : history;

  res.json(history);
});

module.exports = router;

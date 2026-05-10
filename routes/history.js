const express = require("express");
const { collectionsQueries, historyQueries, doujinsQueries } = require("../db");
const { postCollectionsIdAdd, postCollectionsAdd } = require("./utils");
const {
  getArchiveWithTags,
  getCollectionWithArchives,
} = require("../db-utils");

const router = express.Router();

router.get("/all", async (req, res, next) => {
  const { withdata = "false" } = req?.query ?? {};

  const shouldGetData = withdata.toLocaleLowerCase() === "true";

  let history = historyQueries.getAllHistory();

  history = shouldGetData
    ? history.map((his) => {
        return {
          ...his,
          archive: getArchiveWithTags(his?.doujin_id),
        };
      })
    : history;

  res.json(history);
});

router.delete("/", async (req, res, next) => {
  const history = historyQueries.getAllHistory();

  const { changes } = historyQueries.removeAllHistory();

  res.json({
    status: "success",
    message: `Successfully deleted ${changes} history entries!`,
    data: [],
  });
});

module.exports = router;

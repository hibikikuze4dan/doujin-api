const express = require("express");
const { historyQueries, archivesQueries } = require("../db");

const router = express.Router();

router.get("/all", async (req, res, _next) => {
  const { withdata = "false" } = req?.query ?? {};

  const shouldGetData = withdata.toLocaleLowerCase() === "true";

  let history = historyQueries.getAllHistory();

  history = shouldGetData
    ? history.map((his) => {
        return {
          ...his,
          archive: archivesQueries.getArchiveById(his?.archive_id),
        };
      })
    : history;

  res.json(history);
});

router.delete("/", async (req, res, _next) => {
  const { changes } = historyQueries.removeAllHistory();

  res.json({
    status: "success",
    message: `Successfully deleted ${changes} history entries!`,
    data: [],
  });
});

module.exports = router;
